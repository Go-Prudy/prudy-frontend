import { number, object, string } from 'yup';

export const signupSchema = object().shape({
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  phoneNumber: string().required(),
});

export const emailSchema = object().shape({
  email: string().email().required(),
});

export const createBudgetSchema = object().shape({
  name: string().required('Budget name is required'),
  startDate: string().required('Start date is required'),
  endDate: string().required('End date is required'),
});

export const addIncomeSchema = object().shape({
  name: string().required('Income name is required'),
  amount: string()
    .required('Amount is required')
    .test(
      'valid-amount',
      'Amount must be a valid number with optional ₦ symbol and commas',
      (value) => {
        if (!value) return false;

        // Regex to match valid amount format: optional ₦, numbers, and commas
        const amountRegex = /^₦?[\d,]+$/;
        return amountRegex.test(value);
      },
    )
    .test('min-value', 'Amount must be greater than 0', (value) => {
      if (!value) return false;
      // Remove ₦ symbol and commas, then convert to number
      const numericValue = parseFloat(value.replace(/[₦,]/g, ''));
      return numericValue > 0;
    }),
});

export const createCategorySchema = object().shape({
  name: string().required('Category name is required'),
});

export const editCategorySchema = object().shape({
  amount: string()
    .required('Amount is required')
    .test('is-number', 'Must be a valid number', (value) => {
      if (!value) return false;
      const number = value.replace(/[₦,\s]/g, '');
      return !isNaN(parseFloat(number));
    }),
  percentage: number()
    .typeError('Percentage must be a number')
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100%')
    .required('Percentage is required'),
});

export const addSubcategorySchema = object().shape({
  name: string().required('Income name is required'),
  amount: string()
    .required('Amount is required')
    .test(
      'valid-amount',
      'Amount must be a valid number with optional ₦ symbol and commas',
      (value) => {
        if (!value) return false;

        // Regex to match valid amount format: optional ₦, numbers, and commas
        const amountRegex = /^₦?[\d,]+$/;
        return amountRegex.test(value);
      },
    )
    .test('min-value', 'Amount must be greater than 0', (value) => {
      if (!value) return false;
      // Remove ₦ symbol and commas, then convert to number
      const numericValue = parseFloat(value.replace(/[₦,]/g, ''));
      return numericValue > 0;
    }),
});
