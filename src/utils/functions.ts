export const formatNumber = (num: string) => {
  if (!num) return '';
  const [integer, decimal] = num.split('.');
  const formattedInteger = parseInt(integer, 10).toLocaleString();
  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export const formatCategoryNumber = (num: string) => {
  if (!num || isNaN(Number(num))) return '0';

  const [integer, decimal] = num.split('.');
  const formattedInteger = Number(integer).toLocaleString(); // Ensures proper number formatting

  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};
