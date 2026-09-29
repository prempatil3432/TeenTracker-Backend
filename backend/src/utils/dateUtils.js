/**
 * Date utilities for financial reporting and analytics
 */

const getStartAndEndOfMonth = (year, month) => {
  // month is 1-12
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

const getCurrentMonthRange = () => {
  const now = new Date();
  return getStartAndEndOfMonth(now.getFullYear(), now.getMonth() + 1);
};

const getPreviousMonthRange = () => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-indexed, so 0 is Jan, previous is Dec of year - 1
  if (month === 0) {
    year -= 1;
    month = 12;
  }
  return getStartAndEndOfMonth(year, month);
};

const getWeekdayName = (dateStr) => {
  const date = new Date(dateStr);
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[date.getDay()];
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

module.exports = {
  getStartAndEndOfMonth,
  getCurrentMonthRange,
  getPreviousMonthRange,
  getWeekdayName,
  getDaysInMonth,
};
