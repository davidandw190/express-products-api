import { FilterQuery, UpdateQuery } from 'mongoose';
import { UserModel, UserData, UserDocument } from '../model/user.model';
import { omit } from 'lodash';

/**
 * Creates a new user.
 * @param data The user data to create.
 * @returns A Promise resolving to the created user data without the password field.
 * @throws Error if there's an error creating the user.
 */
export async function createUser(data: UserData): Promise<Omit<UserDocument, 'password'>> {
  try {
    const createdUser = await UserModel.create(data);

    return omit(createdUser.toJSON(), 'password') as Omit<UserDocument, 'password'>;
  } catch (error) {
    throw new Error('Unable to create user');
  }
}

/**
 * Validates user's password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise resolving to the user data without the password field if the password is valid, false otherwise.
 */
export async function validatePassword(email: string, password: string): Promise<Omit<UserDocument, 'password'> | false> {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return false; // User not found
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return false; // Password is invalid
    }

    return omit(user.toJSON(), 'password') as Omit<UserDocument, 'password'>;
  } catch (error) {
    throw new Error('Unable to validate password');
  }
}

export async function updateUser(
  query: FilterQuery<UserDocument>,
  data: UpdateQuery<UserDocument>,
): Promise<UserDocument | null> {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(query, data, { new: true });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw new Error('Unable to update user');
  }
}

export async function findUser(query: FilterQuery<UserDocument>): Promise<UserDocument | null> {
  try {
    const user = await UserModel.findOne(query).lean();
    return user;
  } catch (error) {
    throw new Error('Unable to find user');
  }
}
