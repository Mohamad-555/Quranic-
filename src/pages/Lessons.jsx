import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getStudents, getAttendance } from "../data/mockData";
import StudentCard from "@/components/StudentCard";

const Lessons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [expandedLessonIds, setExpandedLessonIds] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!course) {
    navigate("/courses");
    return null;
  }

  const toggleLesson = (id) => {
    setExpandedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (student) => {
    navigate(`/student-profile/${student.id}`);
  };

  const [detailedStudents, setDetailedStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const allStudents = await getStudents();

      // نفلتر الطلاب الموجودين ضمن الدورة فقط
      const filtered = allStudents.filter((student) =>
        course.students.some((s) => s.id === student.id)
      );

      setDetailedStudents(filtered);
    };

    if (course) {
      fetchStudents();
    }
  }, [course]);
 useEffect(() => {
      const fetchAttendance = async () => {
        const data = await getAttendance();
        setAttendance(data);
      };

      fetchAttendance();
    }, []);
  return (
    <div className="min-h-screen bg-islamic-gray-light pt-20">
      {/* زر الرجوع */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center space-x-2 rtl:space-x-reverse text-islamic-primary hover:text-islamic-light transition-colors font-cairo"
        >
          <ArrowRight size={20} />
          <span>العودة إلى الدورات</span>
        </button>
      </div>

      {/* معلومات الدورة */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="font-amiri text-4xl font-bold text-islamic-golden mb-4">
                {course.title}
              </h1>
              <p className="font-cairo text-lg text-gray-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* معلومات المدرس */}
              <div className="bg-islamic-gray-light p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users size={20} className="text-islamic-primary" />
                  <span className="font-cairo font-bold text-islamic-dark">
                    المدرس:{" "}
                    {Array.isArray(course.instructor)
                      ? course.instructor.map((i) => i.name).join(", ")
                      : course.instructor?.name || "غير معروف"}
                  </span>
                </div>
              </div>

              {/* معلومات عدد الطلاب */}
              <div className="bg-islamic-gray-light p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Award size={20} className="text-islamic-golden" />
                  <span className="font-cairo font-bold text-islamic-dark">
                    الطلاب المسجلين: {course.students.length}
                  </span>
                </div>
              </div>

              {/* معلومات التواريخ والمستوى */}
              {/* معلومات التواريخ والمستوى */}
              <div className="bg-islamic-gray-light p-4 rounded-lg space-y-2 mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar size={20} className="text-islamic-primary" />
                  <span className="font-cairo text-gray-700">
                    تاريخ بدء الدورة: {course.start_date}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar size={20} className="text-islamic-primary" />
                  <span className="font-cairo text-gray-700">
                    تاريخ الانتهاء المتوقع: {course.expected_end_date}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Award size={20} className="text-islamic-golden" />
                  <span className="font-cairo text-gray-700">
                    المستوى: {course.level || "غير محدد"}
                  </span>
                </div>
              </div>

              {/* ملفات الدورة */}
              {/* ملفات الدورة (تظهر دائماً حتى لو فاضية) */}
              <div className="bg-islamic-gray-light p-4 rounded-lg mb-4">
                <h3 className="font-cairo font-bold text-lg text-islamic-dark mb-3">
                  📁 ملفات الدورة
                </h3>

                {Array.isArray(course?.course_files) &&
                course.course_files.length > 0 ? (
                  <ul className="space-y-3">
                    {course.course_files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-md shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <svg
                            className="w-5 h-5 text-islamic-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6l-3-4zM6 16V4h6v4h4v8H6z" />
                          </svg>
                          <span className="font-cairo text-gray-700">
                            {file.file_name}
                          </span>
                        </div>
                        <a
                          href={file.file_path}
                          download
                          className="text-sm text-islamic-primary hover:underline font-cairo"
                        >
                          تحميل
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 font-cairo">
                    لا توجد ملفات متاحة حالياً.
                  </p>
                )}
              </div>
            </div>

            {/* صورة الدورة في العمود الثالث */}
            <div className="lg:col-span-1">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* قائمة الدروس */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-primary mb-8">
            الدروس والجلسات
          </h2>

          <div className="space-y-4">
            {course.lessons?.map((lesson) => {
              const lessonAttendance = attendance.filter(
                (a) => a.lesson.id === lesson.id
              );

              const attendanceRate =
                course.students.length > 0
                  ? (lessonAttendance.filter((a) => a.student_attendance)
                      .length /
                      course.students.length) *
                    100
                  : 0;

              const isExpanded = expandedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full flex justify-between items-center p-4 font-cairo text-lg font-bold text-islamic-dark hover:bg-islamic-gray-light transition rounded-t-lg"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Calendar size={18} className="text-islamic-primary" />
                      <span>{lesson.lesson_title}</span>
                      {new Date(lesson.lesson_date) >= new Date() && (
                        <span className="text-xs text-green-600 font-cairo ml-2">
                          قادم
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Calendar
                              size={18}
                              className="text-islamic-primary"
                            />
                            <span className="font-cairo text-gray-600">
                              {lesson.lesson_date}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Clock size={18} className="text-islamic-golden" />
                            <span className="font-cairo text-gray-600">
                              {course.course_start_time}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${attendanceRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 font-cairo">
                          نسبة الحضور: {Math.round(attendanceRate)}%
                        </p>
                      </div>

                      <div>
                        <h4 className="font-cairo font-bold text-lg mb-3 text-islamic-primary">
                          الحضور ({lessonAttendance.length} طالب)
                        </h4>
                        <div className="space-y-1">
                          {lessonAttendance.map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center space-x-2 rtl:space-x-reverse"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  record.student_attendance
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <span className="font-cairo text-gray-700 text-sm">
                                {record.student.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-cairo font-bold text-lg mb-3 text-islamic-primary">
                          وقت حضور الطالب
                        </h4>
                        <ul className="space-y-2">
                          {lessonAttendance.map((record) => (
                            <li
                              key={record.id}
                              className="flex items-start space-x-2 rtl:space-x-reverse"
                            >
                              <Award
                                size={16}
                                className="text-islamic-golden mt-1 flex-shrink-0"
                              />
                              <span className="font-cairo text-gray-700 text-sm">
                                {record.student_attendance_time}
                              </span>
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

      {/* الطلاب */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-primary mb-8 text-center">
            الطلاب المسجلين في الدورة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {detailedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lessons;
