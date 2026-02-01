import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaTrash, FaPlus, FaTimes, FaGripVertical, FaUpload, FaFile, FaSpinner } from 'react-icons/fa';
import { uploadCourseFile, getCourseFiles, deleteCourseFile, formatFileSize, updateFileLoadInBbb } from '../services/courseFiles';

/**
 * CourseBuilder - Full course creation interface with 4 tabs
 * Tabs: Intro, Curriculum, Pricing, Settings
 */
const CourseBuilder = ({ isDarkMode = true, onClose, onSave, initialCourse = null }) => {
  const [activeTab, setActiveTab] = useState('intro');

  // Convert database course format to builder format
  const convertDbToBuilderFormat = (dbCourse) => {
    if (!dbCourse) return null;

    // Parse price from "$249" to 249
    const priceNum = parseInt(String(dbCourse.price).replace(/[^0-9]/g, '')) || 249;

    // Convert curriculum back to sessions/lessons structure
    const sessionsMap = {};
    (dbCourse.curriculum || []).forEach((item, idx) => {
      const sessionNum = item.session || 1;
      if (!sessionsMap[sessionNum]) {
        const sessionInfo = dbCourse.sessions?.list?.find(s => s.number === sessionNum);
        sessionsMap[sessionNum] = {
          id: sessionNum,
          name: sessionInfo?.title || `Session ${sessionNum}`,
          isOpen: true,
          lessons: []
        };
      }
      sessionsMap[sessionNum].lessons.push({
        id: idx + 1,
        name: item.title || 'Untitled Lesson',
        duration: item.duration || '',
        type: 'video',
        description: item.description || '',
        content: null,
        resources: []
      });
    });

    const sessions = Object.values(sessionsMap);
    if (sessions.length === 0) {
      sessions.push({ id: 1, name: 'Session 1', isOpen: true, lessons: [] });
    }

    return {
      title: dbCourse.title || '',
      description: dbCourse.description || '',
      duration: dbCourse.duration || '',
      level: dbCourse.level || 'Beginner',
      thumbnailGradient: dbCourse.thumbnailGradient || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      learningObjectives: dbCourse.learningObjectives?.length ? dbCourse.learningObjectives : [''],
      includes: dbCourse.includes?.length ? dbCourse.includes : ['Full course access', 'Certificate of completion'],
      sessions: sessions,
      price: priceNum,
      pricingOptions: {
        content: true,
        community: dbCourse.peerloopFeatures?.oneOnOneTeaching !== false,
        sessions: dbCourse.peerloopFeatures?.oneOnOneTeaching || false,
        certificate: true,
        earlybird: false,
        memberdiscount: false
      },
      category: dbCourse.category || 'AI Tools',
      tags: dbCourse.tags || [],
      tagInput: '',
      sessionCount: dbCourse.sessions?.count || sessions.length,
      sessionDuration: dbCourse.sessions?.duration || '90 min each',
      sessionFormat: dbCourse.sessions?.format || 'Live 1-on-1 via video call',
      visibility: dbCourse.status === 'published' ? 'published' : 'draft',
      badge: dbCourse.badge || 'New'
    };
  };

  const defaultCourseData = {
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    thumbnailGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    learningObjectives: [''],
    includes: ['Full course access', 'Certificate of completion'],
    sessions: [{ id: 1, name: 'Session 1', isOpen: true, lessons: [] }],
    price: 249,
    pricingOptions: { content: true, community: true, sessions: false, certificate: true, earlybird: false, memberdiscount: false },
    category: 'AI Tools',
    tags: [],
    tagInput: '',
    sessionCount: 2,
    sessionDuration: '90 min each',
    sessionFormat: 'Live 1-on-1 via video call',
    visibility: 'draft',
    badge: 'New'
  };

  const [courseData, setCourseData] = useState(
    convertDbToBuilderFormat(initialCourse) || defaultCourseData
  );

  // Calculate next IDs based on existing data
  const getMaxSessionId = (sessions) => sessions.reduce((max, s) => Math.max(max, s.id), 0);
  const getMaxLessonId = (sessions) => sessions.reduce((max, s) =>
    Math.max(max, ...s.lessons.map(l => l.id || 0)), 0);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [nextSessionId, setNextSessionId] = useState(
    initialCourse ? getMaxSessionId(convertDbToBuilderFormat(initialCourse)?.sessions || []) + 1 : 2
  );
  const [nextLessonId, setNextLessonId] = useState(
    initialCourse ? getMaxLessonId(convertDbToBuilderFormat(initialCourse)?.sessions || []) + 1 : 1
  );

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const sessionFileInputRef = useRef(null);

  // Load existing files when editing a course
  useEffect(() => {
    const loadFiles = async () => {
      if (initialCourse?.id) {
        const { data } = await getCourseFiles(initialCourse.id);
        if (data) {
          // Group files by moduleIndex (numeric: sessionId * 1000 + lessonId)
          const grouped = {};
          data.forEach(file => {
            const key = file.module_index || 'general';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(file);
          });
          setUploadedFiles(grouped);
        }
      }
    };
    loadFiles();
  }, [initialCourse?.id]);

  // Colors
  const bgCard = isDarkMode ? '#1e2a3a' : '#ffffff';
  const bgInput = isDarkMode ? '#0d1520' : '#f8fafc';
  const textPrimary = isDarkMode ? '#ffffff' : '#1a1a2e';
  const textSecondary = isDarkMode ? '#94a3b8' : '#64748b';
  const textMuted = isDarkMode ? '#64748b' : '#94a3b8';
  const border = isDarkMode ? '#2d3e50' : '#e2e8f0';
  const accentBlue = '#3B9EE8';
  const accentGreen = '#22C55E';

  const gradientOptions = [
    { name: 'Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Orange', value: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    { name: 'Green', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { name: 'Pink', value: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
    { name: 'Teal', value: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' }
  ];

  const categories = ['AI Tools', 'AI Coding', 'Machine Learning', 'Automation', 'Developer Tools', 'Business Analytics', 'Data Science'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const badges = ['None', 'New', 'Featured', 'Bestseller', 'Popular'];

  const updateCourse = (field, value) => setCourseData(prev => ({ ...prev, [field]: value }));

  // Learning objectives
  const addObjective = () => setCourseData(prev => ({ ...prev, learningObjectives: [...prev.learningObjectives, ''] }));
  const updateObjective = (index, value) => {
    const newObj = [...courseData.learningObjectives];
    newObj[index] = value;
    setCourseData(prev => ({ ...prev, learningObjectives: newObj }));
  };
  const removeObjective = (index) => {
    if (courseData.learningObjectives.length > 1) {
      setCourseData(prev => ({ ...prev, learningObjectives: prev.learningObjectives.filter((_, i) => i !== index) }));
    }
  };

  // Includes
  const addInclude = () => setCourseData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
  const updateInclude = (index, value) => {
    const newInc = [...courseData.includes];
    newInc[index] = value;
    setCourseData(prev => ({ ...prev, includes: newInc }));
  };
  const removeInclude = (index) => {
    if (courseData.includes.length > 1) {
      setCourseData(prev => ({ ...prev, includes: prev.includes.filter((_, i) => i !== index) }));
    }
  };

  // Tags
  const addTag = () => {
    if (courseData.tagInput.trim() && !courseData.tags.includes(courseData.tagInput.trim())) {
      setCourseData(prev => ({ ...prev, tags: [...prev.tags, prev.tagInput.trim()], tagInput: '' }));
    }
  };
  const removeTag = (tag) => setCourseData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  // Sessions
  const addSession = () => {
    const newSession = { id: nextSessionId, name: `Session ${nextSessionId}`, isOpen: true, lessons: [] };
    setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
    setNextSessionId(prev => prev + 1);
    setSelectedSession(newSession.id);
    setSelectedLesson(null);
  };

  const deleteSession = (sessionId) => {
    if (courseData.sessions.length > 1) {
      setCourseData(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== sessionId) }));
      if (selectedSession === sessionId) { setSelectedSession(null); setSelectedLesson(null); }
    }
  };

  const toggleSession = (sessionId) => {
    setCourseData(prev => ({ ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, isOpen: !s.isOpen } : s) }));
  };

  const updateSessionName = (sessionId, name) => {
    setCourseData(prev => ({ ...prev, sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, name } : s) }));
  };

  // Lessons
  const addLesson = (sessionId) => {
    const newLesson = { id: nextLessonId, name: 'New Lesson', duration: '', type: 'video', description: '', content: null, resources: [] };
    setCourseData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, lessons: [...s.lessons, newLesson], isOpen: true } : s)
    }));
    setNextLessonId(prev => prev + 1);
    setSelectedSession(sessionId);
    setSelectedLesson(newLesson.id);
  };

  const deleteLesson = (sessionId, lessonId) => {
    setCourseData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) } : s)
    }));
    if (selectedLesson === lessonId) setSelectedLesson(null);
  };

  const updateLesson = (sessionId, lessonId, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === sessionId ? { ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) } : s)
    }));
  };

  const getSelectedLesson = () => {
    if (!selectedSession || !selectedLesson) return null;
    const session = courseData.sessions.find(s => s.id === selectedSession);
    return session?.lessons.find(l => l.id === selectedLesson);
  };

  const getSelectedSessionName = () => courseData.sessions.find(s => s.id === selectedSession)?.name || '';

  const togglePricingOption = (option) => {
    setCourseData(prev => ({ ...prev, pricingOptions: { ...prev.pricingOptions, [option]: !prev.pricingOptions[option] } }));
  };

  const platformFee = courseData.price * 0.10;
  const earnings = courseData.price - platformFee;

  const getTypeIcon = (type) => ({ video: '🎬', document: '📄', quiz: '✏️', link: '🔗' }[type] || '📄');

  // File upload handlers
  // Module index encoding: sessionId * 1000 + lessonId (lesson 0 = session-level files)
  const encodeModuleIndex = (sessionId, lessonId = 0) => sessionId * 1000 + lessonId;
  const decodeModuleIndex = (moduleIndex) => ({
    sessionId: Math.floor(moduleIndex / 1000),
    lessonId: moduleIndex % 1000
  });

  const handleFileUpload = async (e, targetType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Get the lesson's position within its session (1-indexed)
    const getLessonIndexInSession = () => {
      const session = courseData.sessions.find(s => s.id === selectedSession);
      if (!session) return 0;
      const lessonIdx = session.lessons.findIndex(l => l.id === selectedLesson);
      return lessonIdx + 1; // 1-indexed to match CourseDetailView
    };

    // Determine the module index based on what's selected (numeric encoding)
    let moduleIndex;
    if (targetType === 'session') {
      moduleIndex = encodeModuleIndex(selectedSession, 0); // 0 = session-level
    } else {
      moduleIndex = encodeModuleIndex(selectedSession, getLessonIndexInSession());
    }

    setIsUploading(true);

    // Get file type from extension
    const ext = file.name.split('.').pop().toLowerCase();
    let fileType = 'document';
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) fileType = 'video';
    else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) fileType = 'image';
    else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) fileType = 'document';

    // Use course ID if editing, or a temp ID for new courses
    const courseId = initialCourse?.id || `temp-${Date.now()}`;
    console.log('📤 Uploading file to course:', courseId, 'module_index:', moduleIndex);

    const { data, error } = await uploadCourseFile(
      file,
      courseId,
      moduleIndex,
      fileType,
      'Course Creator' // TODO: use actual user name
    );

    if (data) {
      setUploadedFiles(prev => ({
        ...prev,
        [moduleIndex]: [...(prev[moduleIndex] || []), data]
      }));
    } else if (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    }

    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  const handleDeleteFile = async (fileId, filePath, moduleIndex) => {
    if (!window.confirm('Delete this file?')) return;

    const { error } = await deleteCourseFile(fileId, filePath);
    if (!error) {
      setUploadedFiles(prev => ({
        ...prev,
        [moduleIndex]: (prev[moduleIndex] || []).filter(f => f.id !== fileId)
      }));
    }
  };

  const handleToggleLoadInBbb = async (fileId, currentValue, moduleIndex) => {
    const newValue = !currentValue;
    const { data, error } = await updateFileLoadInBbb(fileId, newValue);
    if (!error && data) {
      setUploadedFiles(prev => ({
        ...prev,
        [moduleIndex]: (prev[moduleIndex] || []).map(f =>
          f.id === fileId ? { ...f, load_in_bbb: newValue } : f
        )
      }));
    }
  };

  const getLessonModuleIndex = () => {
    if (!selectedSession || !selectedLesson) return 0;
    const session = courseData.sessions.find(s => s.id === selectedSession);
    if (!session) return 0;
    const lessonIdx = session.lessons.findIndex(l => l.id === selectedLesson);
    return encodeModuleIndex(selectedSession, lessonIdx + 1);
  };

  const getFilesForLesson = () => {
    const key = getLessonModuleIndex();
    if (!key) return [];
    return uploadedFiles[key] || [];
  };

  const getFilesForSession = () => {
    if (!selectedSession) return [];
    const key = encodeModuleIndex(selectedSession, 0);
    return uploadedFiles[key] || [];
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'video': return '🎬';
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', background: bgInput, border: `1px solid ${border}`, borderRadius: 8, color: textPrimary, fontSize: 14, outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: textPrimary };
  const sectionStyle = { background: bgCard, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${border}` };
  const sectionTitleStyle = { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: textMuted, marginBottom: 16 };

  // INTRO TAB
  const renderIntroTab = () => (
    <div style={{ padding: 24, overflowY: 'auto', minHeight: 500 }}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Course Title</div>
        <input type="text" value={courseData.title} onChange={(e) => updateCourse('title', e.target.value)} placeholder="Enter course title..." style={{ ...inputStyle, fontSize: 18, fontWeight: 600 }} />
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Short Description</div>
        <textarea value={courseData.description} onChange={(e) => updateCourse('description', e.target.value)} placeholder="Describe what students will learn..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
        <div style={{ fontSize: 12, color: textMuted, marginTop: 8 }}>{courseData.description.length}/150 characters</div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Course Thumbnail</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {gradientOptions.map((g) => (
            <div key={g.name} onClick={() => updateCourse('thumbnailGradient', g.value)} style={{ height: 60, borderRadius: 8, background: g.value, cursor: 'pointer', border: courseData.thumbnailGradient === g.value ? `3px solid ${accentBlue}` : '3px solid transparent', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{g.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div><label style={labelStyle}>Duration</label><input type="text" value={courseData.duration} onChange={(e) => updateCourse('duration', e.target.value)} placeholder="e.g., 3 hours" style={inputStyle} /></div>
          <div><label style={labelStyle}>Level</label><select value={courseData.level} onChange={(e) => updateCourse('level', e.target.value)} style={inputStyle}>{levels.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>What Students Will Learn</div>
        {courseData.learningObjectives.map((obj, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input type="text" value={obj} onChange={(e) => updateObjective(i, e.target.value)} placeholder="Enter a learning objective..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => removeObjective(i)} style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: '#ef4444', cursor: 'pointer' }}><FaTrash size={12} /></button>
          </div>
        ))}
        <button onClick={addObjective} style={{ padding: '10px 16px', background: 'transparent', border: `2px dashed ${border}`, borderRadius: 8, color: accentBlue, cursor: 'pointer', width: '100%', fontSize: 14, fontWeight: 500 }}>+ Add Learning Objective</button>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>What's Included</div>
        {courseData.includes.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input type="text" value={item} onChange={(e) => updateInclude(i, e.target.value)} placeholder="e.g., Full course access" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => removeInclude(i)} style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: '#ef4444', cursor: 'pointer' }}><FaTrash size={12} /></button>
          </div>
        ))}
        <button onClick={addInclude} style={{ padding: '10px 16px', background: 'transparent', border: `2px dashed ${border}`, borderRadius: 8, color: accentBlue, cursor: 'pointer', width: '100%', fontSize: 14, fontWeight: 500 }}>+ Add Item</button>
      </div>
    </div>
  );

  // CURRICULUM TAB
  const renderCurriculumTab = () => (
    <div style={{ display: 'flex', minHeight: 500 }}>
      {/* Left Panel */}
      <div style={{ width: 320, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', background: bgCard }}>
        <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
          {courseData.sessions.map((session, idx) => (
            <div key={session.id} style={{ marginBottom: 12 }}>
              <div onClick={() => { setSelectedSession(session.id); setSelectedLesson(null); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: selectedSession === session.id && !selectedLesson ? accentBlue + '20' : bgInput, borderRadius: 8, cursor: 'pointer', border: selectedSession === session.id && !selectedLesson ? `2px solid ${accentBlue}` : '2px solid transparent' }}>
                <FaGripVertical style={{ color: textMuted, cursor: 'grab' }} />
                <span onClick={(e) => { e.stopPropagation(); toggleSession(session.id); }} style={{ color: textMuted, cursor: 'pointer' }}>{session.isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>
                <span style={{ width: 24, height: 24, background: accentBlue, color: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <input type="text" value={session.name} onChange={(e) => updateSessionName(session.id, e.target.value)} onClick={(e) => e.stopPropagation()} style={{ background: 'transparent', border: 'none', color: textPrimary, fontSize: 14, fontWeight: 500, width: '100%', outline: 'none' }} />
                  <div style={{ fontSize: 12, color: textMuted }}>{session.lessons.length} lessons</div>
                </div>
                <span onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} style={{ color: '#ef4444', cursor: 'pointer', padding: 4, opacity: courseData.sessions.length > 1 ? 1 : 0.3 }}><FaTimes size={12} /></span>
              </div>
              {session.isOpen && (
                <div style={{ paddingLeft: 20, marginTop: 8 }}>
                  {session.lessons.map((lesson) => (
                    <div key={lesson.id} onClick={() => { setSelectedSession(session.id); setSelectedLesson(lesson.id); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, cursor: 'pointer', marginBottom: 4, background: selectedLesson === lesson.id ? accentBlue + '20' : 'transparent', border: selectedLesson === lesson.id ? `2px solid ${accentBlue}` : '2px solid transparent' }}>
                      <FaGripVertical style={{ color: textMuted, fontSize: 10, opacity: 0.5 }} />
                      <span style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: lesson.content ? '#dbeafe' : bgInput, border: lesson.content ? 'none' : `2px dashed ${border}` }}>{lesson.content ? getTypeIcon(lesson.type) : '+'}</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: lesson.content ? textPrimary : textMuted }}>{lesson.name}</div><div style={{ fontSize: 11, color: textMuted }}>{lesson.duration || 'No content yet'}</div></div>
                      <span onClick={(e) => { e.stopPropagation(); deleteLesson(session.id, lesson.id); }} style={{ color: '#ef4444', cursor: 'pointer', padding: 4 }}><FaTimes size={10} /></span>
                    </div>
                  ))}
                  <button onClick={() => addLesson(session.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', color: accentBlue, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'none', width: '100%' }}><FaPlus size={10} /> Add Lesson</button>
                </div>
              )}
            </div>
          ))}
          <button onClick={addSession} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, border: `2px dashed ${border}`, borderRadius: 8, color: textSecondary, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 8, background: 'none', width: '100%' }}><FaPlus size={10} /> Add Session</button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: bgCard }}>
          <div style={{ color: textSecondary, fontSize: 14 }}>{selectedLesson ? <>{getSelectedSessionName()} → <strong style={{ color: textPrimary }}>{getSelectedLesson()?.name}</strong></> : selectedSession ? <strong style={{ color: textPrimary }}>{getSelectedSessionName()}</strong> : 'Select a lesson to edit'}</div>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {selectedLesson ? (
            <>
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Lesson Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div><label style={labelStyle}>Lesson Title</label><input type="text" value={getSelectedLesson()?.name || ''} onChange={(e) => updateLesson(selectedSession, selectedLesson, 'name', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Duration</label><input type="text" value={getSelectedLesson()?.duration || ''} onChange={(e) => updateLesson(selectedSession, selectedLesson, 'duration', e.target.value)} placeholder="e.g., 30 min" style={inputStyle} /></div>
                </div>
                <div style={{ marginTop: 16 }}><label style={labelStyle}>Description</label><textarea value={getSelectedLesson()?.description || ''} onChange={(e) => updateLesson(selectedSession, selectedLesson, 'description', e.target.value)} placeholder="What will students learn?" style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} /></div>
              </div>
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Content Type</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[{ type: 'video', icon: '🎬', label: 'Video' }, { type: 'document', icon: '📄', label: 'Document' }, { type: 'quiz', icon: '✏️', label: 'Quiz' }, { type: 'link', icon: '🔗', label: 'Link' }].map(({ type, icon, label }) => (
                    <button key={type} onClick={() => updateLesson(selectedSession, selectedLesson, 'type', type)} style={{ padding: '20px 16px', border: getSelectedLesson()?.type === type ? `2px solid ${accentBlue}` : `2px solid ${border}`, borderRadius: 10, background: getSelectedLesson()?.type === type ? accentBlue + '20' : bgCard, cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div><div style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{label}</div>
                    </button>
                  ))}
                </div>
                <div style={sectionStyle}>
                  <div style={sectionTitleStyle}>Lesson Files</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, 'lesson')}
                  />
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    style={{ border: `2px dashed ${border}`, borderRadius: 10, padding: '32px 24px', textAlign: 'center', cursor: isUploading ? 'wait' : 'pointer', background: bgInput }}
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner style={{ fontSize: 32, marginBottom: 12, color: accentBlue, animation: 'spin 1s linear infinite' }} />
                        <div style={{ fontSize: 14, color: textSecondary }}>Uploading...</div>
                      </>
                    ) : (
                      <>
                        <FaUpload style={{ fontSize: 32, marginBottom: 12, color: textMuted }} />
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: textPrimary }}>Upload {getSelectedLesson()?.type || 'content'} for this lesson</div>
                        <div style={{ fontSize: 13, color: textSecondary }}>Click to browse or drag & drop</div>
                      </>
                    )}
                  </div>
                  {/* Display uploaded files */}
                  {getFilesForLesson().length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      {getFilesForLesson().map(file => (
                        <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: bgInput, borderRadius: 8, marginBottom: 8, border: `1px solid ${border}` }}>
                          <span style={{ fontSize: 20 }}>{getFileIcon(file.file_type)}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.file_name}</div>
                            <div style={{ fontSize: 11, color: textMuted }}>{formatFileSize(file.file_size)}</div>
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: textSecondary, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={file.load_in_bbb !== false}
                              onChange={() => handleToggleLoadInBbb(file.id, file.load_in_bbb !== false, getLessonModuleIndex())}
                              style={{ cursor: 'pointer' }}
                            />
                            BBB
                          </label>
                          <a href={file.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: accentBlue + '20', color: accentBlue, borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>View</a>
                          <button onClick={() => handleDeleteFile(file.id, file.file_path, getLessonModuleIndex())} style={{ padding: 6, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : selectedSession ? (
            <>
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Session Details</div>
                <label style={labelStyle}>Session Name</label>
                <input type="text" value={getSelectedSessionName()} onChange={(e) => updateSessionName(selectedSession, e.target.value)} style={inputStyle} />
              </div>
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Session Materials</div>
                <div style={{ fontSize: 13, color: textSecondary, marginBottom: 16 }}>Upload files that apply to this entire session (PDFs, slides, resources)</div>
                <input
                  type="file"
                  ref={sessionFileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'session')}
                />
                <div
                  onClick={() => !isUploading && sessionFileInputRef.current?.click()}
                  style={{ border: `2px dashed ${border}`, borderRadius: 10, padding: '32px 24px', textAlign: 'center', cursor: isUploading ? 'wait' : 'pointer', background: bgInput }}
                >
                  {isUploading ? (
                    <>
                      <FaSpinner style={{ fontSize: 32, marginBottom: 12, color: accentBlue, animation: 'spin 1s linear infinite' }} />
                      <div style={{ fontSize: 14, color: textSecondary }}>Uploading...</div>
                    </>
                  ) : (
                    <>
                      <FaUpload style={{ fontSize: 32, marginBottom: 12, color: textMuted }} />
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: textPrimary }}>Upload materials for {getSelectedSessionName()}</div>
                      <div style={{ fontSize: 13, color: textSecondary }}>Click to browse or drag & drop</div>
                    </>
                  )}
                </div>
                {getFilesForSession().length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    {getFilesForSession().map(file => (
                      <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: bgInput, borderRadius: 8, marginBottom: 8, border: `1px solid ${border}` }}>
                        <span style={{ fontSize: 20 }}>{getFileIcon(file.file_type)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.file_name}</div>
                          <div style={{ fontSize: 11, color: textMuted }}>{formatFileSize(file.file_size)}</div>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: textSecondary, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={file.load_in_bbb !== false}
                            onChange={() => handleToggleLoadInBbb(file.id, file.load_in_bbb !== false, encodeModuleIndex(selectedSession, 0))}
                            style={{ cursor: 'pointer' }}
                          />
                          BBB
                        </label>
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: accentBlue + '20', color: accentBlue, borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>View</a>
                        <button onClick={() => handleDeleteFile(file.id, file.file_path, encodeModuleIndex(selectedSession, 0))} style={{ padding: 6, background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}><div style={{ fontSize: 64, marginBottom: 24, opacity: 0.3 }}>📚</div><div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: textPrimary }}>Select a lesson to edit</div><div style={{ color: textSecondary, maxWidth: 400, margin: '0 auto' }}>Click on a lesson from the left, or add a new session to get started.</div></div>
          )}
        </div>
      </div>
    </div>
  );

  // PRICING TAB
  const renderPricingTab = () => (
    <div style={{ padding: 24, overflowY: 'auto', minHeight: 500, maxWidth: 600 }}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Course Price</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 24, fontWeight: 600, color: textMuted }}>$</span><input type="number" value={courseData.price} onChange={(e) => updateCourse('price', parseFloat(e.target.value) || 0)} style={{ ...inputStyle, fontSize: 28, fontWeight: 700, flex: 1 }} /></div>
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>What's Included</div>
        {[{ key: 'content', title: 'Course Content', desc: 'All video lessons, documents, and materials' }, { key: 'community', title: 'Community Access', desc: 'Access to community discussions' }, { key: 'sessions', title: '1-on-1 Sessions', desc: 'Include live tutoring sessions' }, { key: 'certificate', title: 'Certificate', desc: 'Completion certificate' }].map(({ key, title, desc }) => (
          <div key={key} onClick={() => togglePricingOption(key)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, border: `1px solid ${courseData.pricingOptions[key] ? accentBlue : border}`, borderRadius: 8, marginBottom: 10, cursor: 'pointer', background: courseData.pricingOptions[key] ? accentBlue + '10' : 'transparent' }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${courseData.pricingOptions[key] ? accentBlue : border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: courseData.pricingOptions[key] ? accentBlue : 'transparent', color: 'white', fontSize: 12 }}>{courseData.pricingOptions[key] && '✓'}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{title}</div><div style={{ fontSize: 13, color: textSecondary }}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Discount Options</div>
        {[{ key: 'earlybird', title: 'Early Bird Pricing', desc: 'Discount for first 50 students' }, { key: 'memberdiscount', title: 'Community Member Discount', desc: 'Special pricing for members' }].map(({ key, title, desc }) => (
          <div key={key} onClick={() => togglePricingOption(key)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, border: `1px solid ${courseData.pricingOptions[key] ? accentBlue : border}`, borderRadius: 8, marginBottom: 10, cursor: 'pointer', background: courseData.pricingOptions[key] ? accentBlue + '10' : 'transparent' }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${courseData.pricingOptions[key] ? accentBlue : border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: courseData.pricingOptions[key] ? accentBlue : 'transparent', color: 'white', fontSize: 12 }}>{courseData.pricingOptions[key] && '✓'}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14, color: textPrimary }}>{title}</div><div style={{ fontSize: 13, color: textSecondary }}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{ background: `linear-gradient(135deg, ${accentBlue}20 0%, #dbeafe 100%)`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, marginBottom: 12 }}>PRICE PREVIEW</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}><span style={{ color: textPrimary }}>Base Price</span><span style={{ fontWeight: 600, color: accentBlue }}>${courseData.price.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}><span style={{ color: textPrimary }}>Platform Fee (10%)</span><span style={{ color: textSecondary }}>-${platformFee.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', marginTop: 8, borderTop: `1px solid ${accentBlue}30`, fontSize: 14, fontWeight: 600 }}><span style={{ color: textPrimary }}>You Earn</span><span style={{ color: accentBlue }}>${earnings.toFixed(2)}</span></div>
      </div>
    </div>
  );

  // SETTINGS TAB
  const renderSettingsTab = () => (
    <div style={{ padding: 24, overflowY: 'auto', minHeight: 500, maxWidth: 600 }}>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Category</div>
        <select value={courseData.category} onChange={(e) => updateCourse('category', e.target.value)} style={inputStyle}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>{courseData.tags.map(tag => <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: accentBlue + '20', borderRadius: 20, fontSize: 13, color: accentBlue }}>{tag}<FaTimes size={10} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} /></span>)}</div>
        <div style={{ display: 'flex', gap: 8 }}><input type="text" value={courseData.tagInput} onChange={(e) => updateCourse('tagInput', e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag()} placeholder="Add a tag..." style={{ ...inputStyle, flex: 1 }} /><button onClick={addTag} style={{ padding: '12px 20px', background: accentBlue, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Add</button></div>
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Sessions Format</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={labelStyle}>Session Count</label><input type="number" value={courseData.sessionCount} onChange={(e) => updateCourse('sessionCount', parseInt(e.target.value) || 1)} style={inputStyle} /></div>
          <div><label style={labelStyle}>Duration Each</label><input type="text" value={courseData.sessionDuration} onChange={(e) => updateCourse('sessionDuration', e.target.value)} style={inputStyle} /></div>
        </div>
        <div style={{ marginTop: 16 }}><label style={labelStyle}>Format</label><select value={courseData.sessionFormat} onChange={(e) => updateCourse('sessionFormat', e.target.value)} style={inputStyle}><option value="Live 1-on-1 via video call">Live 1-on-1 via video call</option><option value="Self-paced">Self-paced</option><option value="Group sessions">Group sessions</option></select></div>
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Visibility</div>
        {[{ value: 'draft', label: 'Draft', desc: 'Only you can see' }, { value: 'unlisted', label: 'Unlisted', desc: 'Only with link' }, { value: 'published', label: 'Published', desc: 'Visible in Discover' }].map(({ value, label, desc }) => (
          <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', borderRadius: 8, background: courseData.visibility === value ? accentBlue + '10' : 'transparent' }}>
            <input type="radio" name="visibility" value={value} checked={courseData.visibility === value} onChange={(e) => updateCourse('visibility', e.target.value)} style={{ accentColor: accentBlue }} />
            <div><div style={{ fontWeight: 500, color: textPrimary }}>{label}</div><div style={{ fontSize: 13, color: textSecondary }}>{desc}</div></div>
          </label>
        ))}
      </div>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Badge</div>
        <select value={courseData.badge} onChange={(e) => updateCourse('badge', e.target.value)} style={inputStyle}>{badges.map(b => <option key={b} value={b}>{b}</option>)}</select>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button onClick={() => onSave && onSave(courseData, 'draft')} style={{ flex: 1, padding: '14px 24px', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: textPrimary, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Save as Draft</button>
        <button onClick={() => onSave && onSave({ ...courseData, visibility: 'published' }, 'publish')} style={{ flex: 1, padding: '14px 24px', background: accentGreen, border: 'none', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Publish Course</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: textPrimary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>← Back to Content</button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: textPrimary }}>{courseData.title || 'New Course'}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onSave && onSave(courseData, 'draft')} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: textPrimary, cursor: 'pointer', fontWeight: 500 }}>Save Draft</button>
          <button onClick={() => onSave && onSave({ ...courseData, visibility: 'published' }, 'publish')} style={{ padding: '10px 20px', background: accentGreen, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontWeight: 600 }}>Publish</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, marginBottom: 0 }}>
        {[{ id: 'intro', label: 'Intro' }, { id: 'curriculum', label: 'Curriculum' }, { id: 'pricing', label: 'Pricing' }, { id: 'settings', label: 'Settings' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 24px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${accentBlue}` : '2px solid transparent', color: activeTab === tab.id ? accentBlue : textSecondary, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: -1 }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'intro' && renderIntroTab()}
        {activeTab === 'curriculum' && renderCurriculumTab()}
        {activeTab === 'pricing' && renderPricingTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
    </>
  );
};

export default CourseBuilder;
