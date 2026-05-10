const asNumber = (value) => Number(value || 0);

export const getMonthLabel = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

const normalize = (value) => String(value || '').trim().toLowerCase();

const isPaid = (payment) => normalize(payment?.status) === 'paid';

export const resolveClassConfigForStudent = (student, classes) => {
  if (!student || !Array.isArray(classes)) return null;

  const byId = classes.find((c) => String(c.id) === String(student.classRoomId));
  if (byId) return byId;

  return classes.find((c) => `${c.name} - ${c.section}` === student.className) || null;
};

const paidAmountByPrefix = (payments, prefix) => {
  return (payments || [])
    .filter(isPaid)
    .filter((payment) => normalize(payment.month).startsWith(normalize(prefix)))
    .reduce((sum, payment) => sum + asNumber(payment.amount), 0);
};

const paidAmountByExactLabel = (payments, label) => {
  return (payments || [])
    .filter(isPaid)
    .filter((payment) => normalize(payment.month) === normalize(label))
    .reduce((sum, payment) => sum + asNumber(payment.amount), 0);
};

export const buildCurrentDueItems = ({ student, classes, payments, dateValue }) => {
  const classConfig = resolveClassConfigForStudent(student, classes);
  const monthLabel = getMonthLabel(dateValue);
  const items = [];

  const classFee = asNumber(classConfig?.classFee);
  const classFeeLabel = `Class Fee - ${monthLabel}`;
  const classFeePaid = paidAmountByExactLabel(payments, classFeeLabel);
  if (classFee > 0) {
    const balance = Math.max(0, classFee - classFeePaid);
    items.push({
      id: `class-fee-${monthLabel}`,
      label: classFeeLabel,
      total: classFee,
      paid: Math.min(classFee, classFeePaid),
      balance,
      status: balance > 0 ? 'PENDING' : 'PAID',
      type: 'CLASS_FEE',
    });
  }

  const admissionFee = asNumber(classConfig?.admissionFee);
  const admissionLabel = 'Admission Fee - One Time';
  const admissionPaid = paidAmountByPrefix(payments, 'Admission Fee');
  if (admissionFee > 0) {
    const balance = Math.max(0, admissionFee - admissionPaid);
    items.push({
      id: 'admission-fee-one-time',
      label: admissionLabel,
      total: admissionFee,
      paid: Math.min(admissionFee, admissionPaid),
      balance,
      status: balance > 0 ? 'PENDING' : 'PAID',
      type: 'ADMISSION_FEE',
    });
  }

  return items;
};

export const summarizeStudentFees = ({ student, classes, payments, dateValue }) => {
  const currentDueItems = buildCurrentDueItems({ student, classes, payments, dateValue });
  const totalPaid = (payments || [])
    .filter(isPaid)
    .reduce((sum, payment) => sum + asNumber(payment.amount), 0);
  const pendingAmount = currentDueItems.reduce((sum, item) => sum + asNumber(item.balance), 0);
  const dueNow = currentDueItems.filter((item) => item.balance > 0);

  return {
    totalPaid,
    pendingAmount,
    dueNow,
    currentDueItems,
  };
};
