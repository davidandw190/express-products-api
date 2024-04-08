import { TypeOf, object, optional, string } from 'zod';

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
 * Schema for updating a user.
 */
export const updateUserSchema = object({
  body: object({
    name: optional(
      string({
        required_error: 'Name is required',
      }),
    ),

    password: optional(string().min(6, 'Password too short - should be 6 chars minimum')),

    email: optional(
      string({
        required_error: 'Email is required',
      }).email('Not a valid email'),
    ),

    address: optional(string()),
  }),
});

/**
 * Represents the type of data expected when creating a new user.
 */
export type CreateUserData = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;

/**
 * Represents the type of data expected when updating a user.
 */
export type UpdateUserData = TypeOf<typeof updateUserSchema>;
