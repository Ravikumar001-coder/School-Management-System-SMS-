import api from '../api/axios';
import { attendanceApi } from '../api/attendanceApi';

const toList = (value) => (Array.isArray(value) ? value : []);

export const getTeacherScopeData = async (user) => {
  try {
    const res = await api.get('/teacher/scope');
    const data = res.data.data;
    
    // Maintain compatibility with existing component expectations
    return {
      teacher: data.teacher,
      assignedClasses: data.assignedClasses || [],
      students: data.students || [],
      exams: data.exams || [],
      classNameById: Object.fromEntries((data.assignedClasses || []).map(c => [c.id, `${c.name} - ${c.section}`]))
    };
  } catch (error) {
    console.error("Failed to load teacher scope", error);
    throw error;
  }
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
