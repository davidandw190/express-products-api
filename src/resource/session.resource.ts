import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import { createSession } from '../service/session.service';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user password
  const authentiatedUser = await validatePassword(req.body);

  if (!authentiatedUser) {
    return res.status(401).send('Invalid email or password.');
  }

  // create a session
  const session = createSession(
    authentiatedUser._id,
    req.get('user-agent') || '',
  );

  // create an access token

  // create an refresh token

  // return tokens
}
