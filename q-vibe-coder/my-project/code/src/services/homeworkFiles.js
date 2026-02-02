import { supabase } from './supabase';

/**
 * Homework Files Service
 * Handles student homework submission uploads to Supabase Storage and metadata to database
 *
 * Storage bucket: homework-files
 * Database table: homework_submissions
 */

const BUCKET_NAME = 'homework-files';

/**
 * Upload homework file to Supabase Storage and save metadata
 * @param {File} file - The file object from input
 * @param {string} studentId - The student's user ID
 * @param {string} studentName - The student's display name
 * @param {string} courseId - The course ID
 * @param {number} sessionNumber - The session number (1, 2, 3...)
 * @param {number} lessonIndex - The lesson index within the curriculum
 * @returns {Promise<{data: object, error: object}>}
 */
export const uploadHomework = async (file, studentId, studentName, courseId, sessionNumber, lessonIndex = 0) => {
  try {
    // Generate unique filename with student and course info
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${courseId}/session-${sessionNumber}/lesson-${lessonIndex}/${studentId}/${timestamp}_${cleanName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Homework upload error:', uploadError);
      return { data: null, error: uploadError };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Determine file type from extension
    const ext = file.name.split('.').pop().toLowerCase();
    let fileType = 'document';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) fileType = 'image';
    else if (['mp4', 'webm', 'mov'].includes(ext)) fileType = 'video';
    else if (['pdf'].includes(ext)) fileType = 'pdf';

    // Save metadata to database
    const { data: metadata, error: metaError } = await supabase
      .from('homework_submissions')
      .insert([{
        student_id: studentId,
        student_name: studentName,
        course_id: courseId,
        session_number: sessionNumber,
        lesson_index: lessonIndex,
        file_name: file.name,
        file_type: fileType,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (metaError) {
      // If metadata save fails, delete the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      console.error('Homework metadata error:', metaError);
      return { data: null, error: metaError };
    }

    return { data: metadata, error: null };
  } catch (err) {
    console.error('Homework upload failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Get a student's homework submission for a specific lesson
 * @param {string} studentId - The student's user ID
 * @param {string} courseId - The course ID
 * @param {number} sessionNumber - The session number
 * @param {number} lessonIndex - The lesson index within the curriculum
 * @returns {Promise<{data: object|null, error: object}>}
 */
export const getStudentHomework = async (studentId, courseId, sessionNumber, lessonIndex = 0) => {
  try {
    const { data, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .eq('session_number', sessionNumber)
      .eq('lesson_index', lessonIndex)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  } catch (err) {
    console.error('Fetch student homework failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Get all homework submissions for a course (for creator/student-teacher view)
 * @param {string} courseId - The course ID
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getCourseHomework = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('course_id', courseId)
      .order('submitted_at', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    console.error('Fetch course homework failed:', err);
    return { data: [], error: err };
  }
};

/**
 * Get all homework submissions for a specific session (for creator view)
 * @param {string} courseId - The course ID
 * @param {number} sessionNumber - The session number
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getSessionHomework = async (courseId, sessionNumber) => {
  try {
    const { data, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('course_id', courseId)
      .eq('session_number', sessionNumber)
      .order('submitted_at', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    console.error('Fetch session homework failed:', err);
    return { data: [], error: err };
  }
};

/**
 * Update homework status (for creator review)
 * @param {string} submissionId - The submission ID
 * @param {string} status - New status ('submitted', 'reviewed', 'returned')
 * @param {string} feedback - Optional feedback from reviewer
 * @param {string} reviewerName - Name of the reviewer
 * @returns {Promise<{data: object, error: object}>}
 */
export const updateHomeworkStatus = async (submissionId, status, feedback = null, reviewerName = null) => {
  try {
    const updates = {
      status,
      reviewed_at: new Date().toISOString()
    };
    if (feedback) updates.feedback = feedback;
    if (reviewerName) updates.reviewed_by = reviewerName;

    const { data, error } = await supabase
      .from('homework_submissions')
      .update(updates)
      .eq('id', submissionId)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Update homework status failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Replace a homework submission (delete old, upload new)
 * @param {string} oldSubmissionId - The old submission ID to replace
 * @param {string} oldFilePath - The old file's storage path
 * @param {File} newFile - The new file to upload
 * @param {string} studentId - The student's user ID
 * @param {string} studentName - The student's display name
 * @param {string} courseId - The course ID
 * @param {number} sessionNumber - The session number
 * @param {number} lessonIndex - The lesson index within the curriculum
 * @returns {Promise<{data: object, error: object}>}
 */
export const replaceHomework = async (oldSubmissionId, oldFilePath, newFile, studentId, studentName, courseId, sessionNumber, lessonIndex = 0) => {
  try {
    // Delete old file from storage
    if (oldFilePath) {
      await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
    }

    // Delete old metadata
    await supabase
      .from('homework_submissions')
      .delete()
      .eq('id', oldSubmissionId);

    // Upload new file
    return await uploadHomework(newFile, studentId, studentName, courseId, sessionNumber, lessonIndex);
  } catch (err) {
    console.error('Replace homework failed:', err);
    return { data: null, error: err };
  }
};

/**
 * Delete a homework submission
 * @param {string} submissionId - The submission ID
 * @param {string} filePath - The storage path
 * @returns {Promise<{error: object}>}
 */
export const deleteHomework = async (submissionId, filePath) => {
  try {
    // Delete from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (storageError) {
        console.error('Homework storage delete error:', storageError);
      }
    }

    // Delete metadata
    const { error } = await supabase
      .from('homework_submissions')
      .delete()
      .eq('id', submissionId);

    return { error };
  } catch (err) {
    console.error('Delete homework failed:', err);
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
