/**
 * CSV Generation utility adhering to RFC 4180
 */

const escapeCsvField = (field) => {
  if (field === null || field === undefined) {
    return '""';
  }
  const stringField = String(field);
  // If the field contains quotes, commas, or newlines, escape quotes by doubling them and wrap in quotes
  if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return `"${stringField}"`;
};

const generateExpensesCsv = (expenses) => {
  const headers = ['Date', 'Description', 'Category', 'Merchant', 'Payment Method', 'Amount', 'Notes'];
  const headerRow = headers.map(escapeCsvField).join(',');

  const rows = expenses.map((exp) => {
    const categoryName = exp.category?.name || exp.category_name || 'Uncategorized';
    return [
      exp.expense_date,
      exp.description,
      categoryName,
      exp.merchant || '',
      exp.payment_method,
      Number(exp.amount).toFixed(2),
      exp.notes || '',
    ].map(escapeCsvField).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
};

const generateIncomeCsv = (incomeList) => {
  const headers = ['Date', 'Source', 'Amount', 'Description'];
  const headerRow = headers.map(escapeCsvField).join(',');

  const rows = incomeList.map((inc) => {
    return [
      inc.income_date,
      inc.source,
      Number(inc.amount).toFixed(2),
      inc.description || '',
    ].map(escapeCsvField).join(',');
  });

  return [headerRow, ...rows].join('\r\n');
};

module.exports = {
  generateExpensesCsv,
  generateIncomeCsv,
};
