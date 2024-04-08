import { Request, Response } from 'express';
import { validatePassword } from '../service/user.service';
import { createSession } from '../service/session.service';
import { signToken } from '../utils/jwt.utils';
import { SessionDocument } from '../model/session.model';
import config from 'config';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate user password
  const authenticatedUser = await validatePassword(req.body?.email, req.body?.password);

  if (!authenticatedUser) {
    return res.status(401).send('Invalid email or password.');
  }

  const session: SessionDocument = await createSession(authenticatedUser._id, req.get('user-agent') || '');

  const accessToken = signToken(
    { ...authenticatedUser, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: config.get('ACCESS_TOKEN_TTL') }, // 25 min
  );

  const refreshToken = signToken(
    { ...authenticatedUser, session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn: config.get('REFRESH_TOKEN_TTL') }, // 5 days
  );

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  
  
}
