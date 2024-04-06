import { UserModel, UserData, UserDocument } from '../model/user.model';
import { omit } from 'lodash';

/**
 * Creates a new user.
 * @param data The user data to create.
 * @returns A Promise resolving to the created user data without the password field.
 * @throws Error if there's an error creating the user.
 */
export async function createUser(data: UserData) {
  try {
    const createdUser = await UserModel.create(data);

    return omit(createdUser.toJSON(), 'password');
  } catch (exception: any) {
    throw new Error(exception);
  }
}

/**
 * Validates user's password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise resolving to the user data without the password field if the password is valid, false otherwise.
 */
export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Omit<UserDocument, 'password'> | false> {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;  // User not found
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false; // Password is invalid
  }

  return omit(user.toJSON(), 'password');
}
