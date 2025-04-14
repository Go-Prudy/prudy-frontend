export const formatNumber = (num: string) => {
  if (!num) return '';
  const [integer, decimal] = num.split('.');
  const formattedInteger = parseInt(integer, 10).toLocaleString();
  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export const formatCategoryNumber = (num: string) => {
  if (!num || isNaN(Number(num))) return '0';

  const [integer, decimal] = num.split('.');
  const formattedInteger = Number(integer).toLocaleString();

  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export const lightenColor = (hex: string, percent: number): string => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const { r, g, b } = hexToRgb(hex);

  const newR = Math.min(255, Math.round(r + (255 - r) * percent));
  const newG = Math.min(255, Math.round(g + (255 - g) * percent));
  const newB = Math.min(255, Math.round(b + (255 - b) * percent));

  return rgbToHex(newR, newG, newB);
};

// Function to generate a unique random color
export const generateUniqueColors = (count: number): string[] => {
  const colors = new Set<string>();

  while (colors.size < count) {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    colors.add(color);
  }

  return Array.from(colors);
};

export const formatAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;
  value = value.replace(/[^\d]/g, '');
  if (value) {
    value = '₦' + Number(value).toLocaleString();
  }
  e.target.value = value;
};

export const getLastFourDigits = (accountNumber: string): string => {
  if (!accountNumber) {
    return '';
  } else {
    return accountNumber.slice(-4);
  }
};
