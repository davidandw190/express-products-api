import { Request, Response } from 'express';
import { error } from 'console';
import { log } from '../utils/logger.utils';
import { createUser, deleteUser, updateUser } from '../service/user.service';
import { CreateUserData, UpdateUserData } from '../schema/user.schema';

export async function createUserHandler(req: Request<{}, {}, CreateUserData['body']>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (exeption: unknown) {
    log.error(error);
    return res.status(409).send(exeption);
  }
}

/**
 * Handler for updating a user.
 * @param req Express request object.
 * @param res Express response object.
 */
export async function updateUserHandler(req: Request<{}, {}, UpdateUserData['body']>, res: Response) {
  try {
    const userId = req.body.id;
    const updatedUser = await updateUser({ _id: userId }, req.body);

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    return res.send(updatedUser);
  } catch (error) {
    log.error(error);
    return res.status(400).send({ error: 'Unable to update user' });
  }
}

export async function deleteUserHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const userId = req.params.id;
    const deletionResult = await deleteUser({ _id: userId});

    if (!deletionResult) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    return res.send({ message: 'User deleted successfully' });

  } catch (error) {
    log.error(error);
    return res.status(400).send({ error: 'Unable to delete user' });
  }
}
