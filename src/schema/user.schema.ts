import { TypeOf, object, string } from 'zod';

/**
 * Schema for creating a new user.
 */
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),

    password: string({
      required_error: 'You must set a password',
    }).min(6, 'Password too short - should be 6 chars minimum'),

    passwordConfirmation: string({
      required_error: 'Confirming your password is required',
    }),

    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),

    address: string(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

/**
 * Represents the type of data expected when creating a new user.
 */
export type CreateUserData = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
