export const capitalize = (value = '') =>
  value.length ? value.charAt(0).toUpperCase() + value.slice(1) : '';

export const formatDate = (date) => {
  if (!date) {
    return '-';
  }
  return new Date(date).toLocaleDateString();
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

export const getCurrentAcademicYear = (dateValue = new Date()) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
};
