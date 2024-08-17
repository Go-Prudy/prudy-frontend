function uppercase(value: string) {
  return value.at(0)?.toUpperCase() + value.slice(1);
}

function formatCurrency(amount: string | number) {
  return amount.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
  });
}

export { uppercase, formatCurrency };
