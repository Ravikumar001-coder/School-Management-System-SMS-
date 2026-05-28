import api from './axios';

// --- INFRASTRUCTURE ---

export const getHostelBlocks = async (branchId) => {
  const { data } = await api.get(`/hostel/infrastructure/branches/${branchId}/blocks`);
  return data;
};

export const createHostelBlock = async (branchId, blockData) => {
  const { data } = await api.post(`/hostel/infrastructure/branches/${branchId}/blocks`, blockData);
  return data;
};

export const updateHostelBlock = async (blockId, blockData) => {
  const { data } = await api.put(`/hostel/infrastructure/blocks/${blockId}`, blockData);
  return data;
};

export const deleteHostelBlock = async (blockId) => {
  const { data } = await api.delete(`/hostel/infrastructure/blocks/${blockId}`);
  return data;
};

export const getHostelFloors = async (blockId) => {
  const { data } = await api.get(`/hostel/infrastructure/blocks/${blockId}/floors`);
  return data;
};

export const createHostelFloor = async (blockId, floorData) => {
  const { data } = await api.post(`/hostel/infrastructure/blocks/${blockId}/floors`, floorData);
  return data;
};

export const deleteHostelFloor = async (floorId) => {
  const { data } = await api.delete(`/hostel/infrastructure/floors/${floorId}`);
  return data;
};

export const getHostelRooms = async (floorId) => {
  const { data } = await api.get(`/hostel/infrastructure/floors/${floorId}/rooms`);
  return data;
};

export const createHostelRoom = async (floorId, roomData) => {
  const { data } = await api.post(`/hostel/infrastructure/floors/${floorId}/rooms`, roomData);
  return data;
};

export const deleteHostelRoom = async (roomId) => {
  const { data } = await api.delete(`/hostel/infrastructure/rooms/${roomId}`);
  return data;
};

export const getBranchInfrastructureMap = async (branchId) => {
  const { data } = await api.get(`/hostel/infrastructure/branches/${branchId}/map`);
  return data;
};

// --- ALLOCATIONS ---

export const getAllocations = async () => {
  const { data } = await api.get(`/hostel/allocations`);
  return data;
};

export const checkStudentEligibility = async (studentId) => {
  const { data } = await api.get(`/hostel/allocations/eligibility/${studentId}`);
  return data;
};

export const allocateRoom = async (allocationData) => {
  const { data } = await api.post(`/hostel/allocations`, allocationData);
  return data;
};

export const bulkAllocateRooms = async (bulkData) => {
  const { data } = await api.post(`/hostel/allocations/bulk`, bulkData);
  return data;
};

export const transferRoom = async (allocationId, transferData) => {
  const { data } = await api.post(`/hostel/allocations/${allocationId}/transfer`, transferData);
  return data;
};

export const vacateRoom = async (allocationId, vacateData) => {
  const { data } = await api.post(`/hostel/allocations/${allocationId}/vacate`, vacateData || {});
  return data;
};

// --- ATTENDANCE ---

export const createHostelAttendanceSession = async (branchId, sessionData) => {
  const { data } = await api.post(`/hostel/attendance/branches/${branchId}/sessions`, sessionData);
  return data;
};

export const markHostelAttendance = async (sessionId, logData) => {
  const { data } = await api.post(`/hostel/attendance/sessions/${sessionId}/logs`, logData);
  return data;
};

// --- MESS BILLING ---

export const getMessPlans = async (branchId) => {
  const { data } = await api.get(`/hostel/mess/branches/${branchId}/plans`);
  return data;
};

export const createMessPlan = async (branchId, planData) => {
  const { data } = await api.post(`/hostel/mess/branches/${branchId}/plans`, planData);
  return data;
};

export const generateMessBillPreview = async (billData) => {
  const { data } = await api.post(`/hostel/mess/bills/preview`, billData);
  return data;
};

export const generateMessBill = async (billData) => {
  const { data } = await api.post(`/hostel/mess/bills/generate`, billData);
  return data;
};

export const getMessBills = async () => {
  const { data } = await api.get(`/hostel/mess/bills`);
  return data;
};

export const getMessPayments = async () => {
  const { data } = await api.get(`/hostel/mess/payments`);
  return data;
};

export const recordMessPayment = async (paymentData) => {
  const { data } = await api.post(`/hostel/mess/payments`, paymentData);
  return data;
};

export const payMessBill = async (billId) => {
  const { data } = await api.put(`/hostel/mess/bills/${billId}/pay`);
  return data;
};

// --- DASHBOARD ---

export const getDashboardStats = async (branchId) => {
  const { data } = await api.get(`/hostel/dashboard/stats/branches/${branchId}`);
  return data;
};
