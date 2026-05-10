import { teacherApi } from '../api/teacherApi';
import { classApi } from '../api/classApi';
import { studentApi } from '../api/studentApi';
import { examApi } from '../api/examApi';
import { attendanceApi } from '../api/attendanceApi';

const toList = (value) => (Array.isArray(value) ? value : []);

const classLabel = (classRoom) => `${classRoom.name} - ${classRoom.section}`;

const uniqueById = (items) => {
  const seen = new Set();
  return toList(items).filter((item) => {
    if (!item || seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

const teacherMatchScore = (teacher, user) => {
  if (!teacher || !user) {
    return -1;
  }

  const userFirst = (user.firstName || '').trim().toLowerCase();
  const userLast = (user.lastName || '').trim().toLowerCase();
  const teacherFirst = (teacher.firstName || '').trim().toLowerCase();
  const teacherLast = (teacher.lastName || '').trim().toLowerCase();

  if (teacher.email && user.email && teacher.email.toLowerCase() === user.email.toLowerCase()) {
    return 100;
  }

  if (teacher.employeeId && user.username && teacher.employeeId.toLowerCase() === user.username.toLowerCase()) {
    return 95;
  }

  if (teacherFirst === userFirst && teacherLast === userLast && userFirst) {
    return 80;
  }

  return 0;
};

const resolveTeacher = async (user) => {
  const queries = [
    user?.email,
    user?.username,
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
  ].filter(Boolean);

  const candidates = [];

  for (const query of queries) {
    try {
      const res = await teacherApi.search(query);
      candidates.push(...toList(res?.data?.data));
    } catch {
      // Ignore search misses and keep trying fallback queries.
    }
  }

  if (candidates.length === 0) {
    const res = await teacherApi.getAll(0, 500);
    const pageData = res?.data?.data;
    const allTeachers = Array.isArray(pageData?.content) ? pageData.content : toList(pageData);
    candidates.push(...allTeachers);
  }

  const deduped = uniqueById(candidates);
  if (deduped.length === 0) {
    return null;
  }

  return deduped.sort((a, b) => teacherMatchScore(b, user) - teacherMatchScore(a, user))[0];
};

export const getTeacherScopeData = async (user) => {
  const [teacher, classesRes, examsRes] = await Promise.all([
    resolveTeacher(user),
    classApi.getAll(),
    examApi.getAll(),
  ]);

  const allClasses = toList(classesRes?.data?.data);
  const allExams = toList(examsRes?.data?.data);

  if (!teacher) {
    return {
      teacher: null,
      assignedClasses: [],
      students: [],
      exams: [],
      classNameById: {},
    };
  }

  const assignedIdsFromTeacher = toList(teacher.assignedClassIds);
  const fallbackAssignedIds = allClasses
    .filter((c) => c.classTeacherId === teacher.id)
    .map((c) => c.id);

  const assignedClassIds = assignedIdsFromTeacher.length
    ? assignedIdsFromTeacher
    : fallbackAssignedIds;

  const assignedClasses = allClasses.filter((c) => assignedClassIds.includes(c.id));
  const classNameById = Object.fromEntries(assignedClasses.map((c) => [c.id, classLabel(c)]));

  const studentResults = await Promise.all(
    assignedClasses.map(async (c) => {
      try {
        const res = await studentApi.byClass(c.id);
        return toList(res?.data?.data).map((student) => ({ ...student, _classId: c.id }));
      } catch {
        return [];
      }
    })
  );

  const students = uniqueById(studentResults.flat());
  const classNames = new Set(assignedClasses.map((c) => classLabel(c)));
  const exams = allExams.filter((exam) => classNames.has(exam.className));

  return {
    teacher,
    assignedClasses,
    students,
    exams,
    classNameById,
  };
};

export const getTodayAttendanceSummary = async (assignedClasses) => {
  const today = new Date().toISOString().slice(0, 10);

  const rows = await Promise.all(
    toList(assignedClasses).map(async (classRoom) => {
      try {
        const res = await attendanceApi.classReport(classRoom.id, today);
        const data = res?.data?.data || {};
        const total = Number(data.total || 0);
        const present = Number(data.present || 0);
        const absent = Number(data.absent || 0);

        return {
          classId: classRoom.id,
          className: `${classRoom.name}-${classRoom.section}`,
          total,
          present,
          absent,
          rate: total > 0 ? Math.round((present / total) * 100) : 0,
        };
      } catch {
        return {
          classId: classRoom.id,
          className: `${classRoom.name}-${classRoom.section}`,
          total: 0,
          present: 0,
          absent: 0,
          rate: 0,
        };
      }
    })
  );

  const totals = rows.reduce(
    (acc, row) => {
      acc.total += row.total;
      acc.present += row.present;
      acc.absent += row.absent;
      return acc;
    },
    { total: 0, present: 0, absent: 0 }
  );

  return {
    date: today,
    rows,
    total: totals.total,
    present: totals.present,
    absent: totals.absent,
    rate: totals.total > 0 ? Math.round((totals.present / totals.total) * 100) : 0,
  };
};
