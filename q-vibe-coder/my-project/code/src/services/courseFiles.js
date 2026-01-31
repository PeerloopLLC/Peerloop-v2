import { supabase } from './supabase';

/**
 * Course Files Service
 * Handles file upload to Supabase Storage and metadata to database
 *
 * Storage bucket: course-files
 * Database table: course_files
 */

const BUCKET_NAME = 'course-files';

/**
 * Upload a file to Supabase Storage and save metadata
 * @param {File} file - The file object from input
 * @param {string} courseId - The course ID
 * @param {number} moduleIndex - The module index within the course
 * @param {string} fileType - Type category (document, video, link, image)
 * @param {string} uploadedBy - User name who uploaded
 * @returns {Promise<{data: object, error: object}>}
 */
export const uploadCourseFile = async (file, courseId, moduleIndex, fileType, uploadedBy) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${courseId}/${moduleIndex}/${timestamp}_${cleanName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { data: null, error: uploadError };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Save metadata to database
    const { data: metadata, error: metaError } = await supabase
      .from('course_files')
      .insert([{
        course_id: courseId,
        module_index: moduleIndex,
        file_name: file.name,
        file_type: fileType,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (metaError) {
      // If metadata save fails, delete the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      console.error('Metadata error:', metaError);
      return { data: null, error: metaError };
    }

    return { data: metadata, error: null };
  } catch (err) {
    console.error('Upload failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Add a file link (no upload, just metadata for external URLs)
 * @param {string} fileName - Display name for the file
 * @param {string} fileUrl - External URL (Google Drive, Dropbox, etc.)
 * @param {string} courseId - The course ID
 * @param {number} moduleIndex - The module index
 * @param {string} fileType - Type category
 * @param {string} uploadedBy - User name
 * @returns {Promise<{data: object, error: object}>}
 */
export const addCourseFileLink = async (fileName, fileUrl, courseId, moduleIndex, fileType, uploadedBy) => {
  try {
    const { data, error } = await supabase
      .from('course_files')
      .insert([{
        course_id: courseId,
        module_index: moduleIndex,
        file_name: fileName,
        file_type: fileType,
        file_path: null,
        file_url: fileUrl,
        file_size: null,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Add link failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Get all files for a course
 * @param {string} courseId - The course ID
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getCourseFiles = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('course_files')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    return { data: data || [], error };
  } catch (err) {
    console.error('Fetch files failed:', err);
    return { data: [], error: err };
  }
};

/**
 * Get files for a specific module
 * @param {string} courseId - The course ID
 * @param {number} moduleIndex - The module index
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getModuleFiles = async (courseId, moduleIndex) => {
  try {
    const { data, error } = await supabase
      .from('course_files')
      .select('*')
      .eq('course_id', courseId)
      .eq('module_index', moduleIndex)
      .order('created_at', { ascending: true });

    return { data: data || [], error };
  } catch (err) {
    console.error('Fetch module files failed:', err);
    return { data: [], error: err };
  }
};

/**
 * Delete a course file
 * @param {string} fileId - The file record ID
 * @param {string} filePath - The storage path (if uploaded file)
 * @returns {Promise<{error: object}>}
 */
export const deleteCourseFile = async (fileId, filePath) => {
  try {
    // Delete from storage if it's an uploaded file
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }
    }

    // Delete metadata
    const { error } = await supabase
      .from('course_files')
      .delete()
      .eq('id', fileId);

    return { error };
  } catch (err) {
    console.error('Delete failed:', err);
    return { error: err };
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
