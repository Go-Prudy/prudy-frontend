import { object, string } from 'yup';

export const signupSchema = object().shape({
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  phoneNumber: string().required(),
});

export const emailSchema = object().shape({
  email: string().email().required(),
});
