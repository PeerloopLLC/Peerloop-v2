/**
 * Local Course Files Service
 * Browser-only stand-in for the Supabase `course_files` table and `course-files`
 * bucket, used by courseFiles.js when REACT_APP_FILE_STORAGE=local.
 *
 * Files are saved in this browser's IndexedDB, so they survive reloads and are
 * shared by every demo account on this origin, but not with other browsers or
 * machines. Rows use the same shape as the Supabase table; uploaded files get a
 * blob: URL in `file_url` each time they are read.
 */

const DB_NAME = 'peerloop-local-course-files';
const STORE_NAME = 'course_files';

const openDb = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    const store = request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    store.createIndex('course_id', 'course_id');
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

// Run one IndexedDB request against the store and resolve with its result
const withStore = async (mode, makeRequest) => {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const request = makeRequest(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
};

// One blob: URL per stored file, reused across reads
const objectUrls = new Map();

const toRow = ({ blob, ...row }) => {
  if (!blob) return row;
  if (!objectUrls.has(row.id)) {
    objectUrls.set(row.id, URL.createObjectURL(blob));
  }
  return { ...row, file_url: objectUrls.get(row.id) };
};

const newRow = (courseId, moduleIndex, fileName, fileType, uploadedBy) => {
  const id = crypto.randomUUID();
  return {
    id,
    course_id: String(courseId),
    module_index: moduleIndex,
    file_name: fileName,
    file_type: fileType,
    file_path: null,
    file_url: null,
    file_size: null,
    uploaded_by: uploadedBy,
    created_at: new Date().toISOString()
  };
};

export const uploadCourseFile = async (file, courseId, moduleIndex, fileType, uploadedBy) => {
  try {
    const row = newRow(courseId, moduleIndex, file.name, fileType, uploadedBy);
    const record = { ...row, file_path: `local/${row.id}`, file_size: file.size, blob: file };
    await withStore('readwrite', store => store.put(record));
    return { data: toRow(record), error: null };
  } catch (err) {
    console.error('Local upload failed:', err);
    return { data: null, error: err };
  }
};

export const addCourseFileLink = async (fileName, fileUrl, courseId, moduleIndex, fileType, uploadedBy) => {
  try {
    const record = { ...newRow(courseId, moduleIndex, fileName, fileType, uploadedBy), file_url: fileUrl };
    await withStore('readwrite', store => store.put(record));
    return { data: record, error: null };
  } catch (err) {
    console.error('Local add link failed:', err);
    return { data: null, error: err };
  }
};

export const getCourseFiles = async (courseId) => {
  try {
    const records = await withStore('readonly', store => store.index('course_id').getAll(String(courseId)));
    const rows = records
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(toRow);
    return { data: rows, error: null };
  } catch (err) {
    console.error('Local fetch files failed:', err);
    return { data: [], error: err };
  }
};

export const getModuleFiles = async (courseId, moduleIndex) => {
  const { data, error } = await getCourseFiles(courseId);
  return { data: data.filter(row => row.module_index === moduleIndex), error };
};

export const updateFileLoadInBbb = async (fileId, loadInBbb) => {
  try {
    const record = await withStore('readonly', store => store.get(fileId));
    if (!record) {
      return { data: null, error: new Error('File not found') };
    }
    const updated = { ...record, load_in_bbb: loadInBbb };
    await withStore('readwrite', store => store.put(updated));
    return { data: toRow(updated), error: null };
  } catch (err) {
    console.error('Local update load_in_bbb failed:', err);
    return { data: null, error: err };
  }
};

export const deleteCourseFile = async (fileId) => {
  try {
    await withStore('readwrite', store => store.delete(fileId));
    if (objectUrls.has(fileId)) {
      URL.revokeObjectURL(objectUrls.get(fileId));
      objectUrls.delete(fileId);
    }
    return { error: null };
  } catch (err) {
    console.error('Local delete failed:', err);
    return { error: err };
  }
};
