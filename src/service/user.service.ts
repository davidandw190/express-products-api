import { UserModel, UserData } from '../model/user.model';
import { omit } from 'lodash';

export async function createUser(data: UserData) {
  try {
    const createdUser = await UserModel.create(data);

    return omit(createdUser.toJSON(), 'password');
  } catch (exception: any) {
    throw new Error(exception);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), 'password');
}
