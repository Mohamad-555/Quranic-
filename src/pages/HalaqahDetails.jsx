import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Award, ChevronDown, ChevronUp, Users, Download } from 'lucide-react';
import { attendance, students  } from '../data/mockData';
const HalaqahDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { halaqah, course } = location.state || {};
  const [expandedLessonIds, setExpandedLessonIds] = useState([]);

  if (!halaqah) {
    navigate('/courses');
    return null;
  }

  const toggleLesson = (id) => {
    setExpandedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-islamic-gray-light pt-20">
      {/* زر الرجوع */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/tahfeez-course', { state: { course } })}
          className="flex items-center space-x-2 rtl:space-x-reverse text-islamic-primary hover:text-islamic-light transition-colors font-cairo"
        >
          <ArrowRight size={20} />
          <span>العودة إلى دورة التحفيظ</span>
        </button>
      </div>

      {/* معلومات الحلقة */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="font-amiri text-4xl font-bold text-islamic-primary mb-4">حلقة التحفيظ</h1>
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6 p-4 bg-islamic-gray-light rounded-lg">
                <div>
                  <h3 className="font-cairo font-bold text-xl text-islamic-dark">
                    {Array.isArray(halaqah.instructor) ? halaqah.instructor.map((i) => i.name).join(', ') : halaqah.instructor?.name || 'غير معروف'}
                  </h3>
                  <p className="font-cairo text-gray-600">مدرس التحفيظ</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-islamic-gray-light p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
                    <Users size={20} className="text-islamic-primary" />
                    <span className="font-cairo font-bold text-2xl text-islamic-primary">{halaqah.students.length}</span>
                  </div>
                  <p className="font-cairo text-gray-600">طالب في الحلقة</p>
                </div>
                <div className="bg-islamic-gray-light p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-2">
                    <Award size={20} className="text-islamic-golden" />
                    <span className="font-cairo font-bold text-2xl text-islamic-primary">{halaqah.lessons?.length || 0}</span>
                  </div>
                  <p className="font-cairo text-gray-600">جلسة تعليمية</p>
                </div>
              </div>
            </div>
            <div>
              <img src={halaqah.image} alt="صورة الحلقة" className="w-full h-64 object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* قائمة الجلسات */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-primary mb-8">الجلسات التعليمية</h2>

          <div className="space-y-4">
            {halaqah.lessons?.map((lesson) => {
              const lessonAttendance =  attendance.filter(
                              (a) => a.lesson_details.id === lesson.id
                            );
              const attendanceRate = halaqah.students.length > 0 ? (lessonAttendance.filter(a => a.student_attendance).length / halaqah.students.length) * 100 : 0;
              const isExpanded = expandedLessonIds.includes(lesson.id);

              return (
                <div key={lesson.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full flex justify-between items-center p-4 font-cairo text-lg font-bold text-islamic-dark hover:bg-islamic-gray-light transition rounded-t-lg"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Calendar size={18} className="text-islamic-primary" />
                      <span>{lesson.lesson_title || 'جلسة بدون عنوان'}</span>
                      {new Date(lesson.lesson_date) >= new Date() && (
                        <span className="text-xs text-green-600 font-cairo ml-2">قادم</span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {isExpanded && (
                    <div className="p-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Calendar size={18} className="text-islamic-primary" />
                            <span className="font-cairo text-gray-600">{lesson.lesson_date}</span>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Clock size={18} className="text-islamic-golden" />
                            <span className="font-cairo text-gray-600">{halaqah.course_start_time || 'غير محدد'}</span>
                          </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-cairo">نسبة الحضور: {Math.round(attendanceRate)}%</p>
                      </div>

                      <div>
                        <h4 className="font-cairo font-bold text-lg mb-3 text-islamic-primary">الحضور ({lessonAttendance.length} طالب)</h4>
                        <div className="space-y-1">
                          {lessonAttendance.map((record, index) => (
                            <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className={`w-2 h-2 rounded-full ${record.student_attendance ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="font-cairo text-gray-700 text-sm">{record.student.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-cairo font-bold text-lg mb-3 text-islamic-primary">وقت حضور الطالب</h4>
                        <ul className="space-y-2">
                          {lessonAttendance.map((record, index) => (
                            <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                              <Award size={16} className="text-islamic-golden mt-1 flex-shrink-0" />
                              <span className="font-cairo text-gray-700 text-sm">{record.student_attendance_time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* زر تحميل الملفات */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <button className="bg-islamic-golden text-white px-8 py-4 rounded-lg font-cairo font-bold text-lg hover:bg-opacity-90 transition-colors inline-flex items-center space-x-2 rtl:space-x-reverse">
            <Download size={24} />
            <span>تحميل ملفات الحلقة</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HalaqahDetails;
