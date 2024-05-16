import { Request, Response } from 'express';
import { createSession, findSessions, updateSession } from '../service/session.service';

import { SessionDocument } from '../model/session.model';
import { signToken } from '../utils/jwt.utils';
import { validatePassword } from '../service/user.service';

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
    { expiresIn:  process.env.ACCESS_TOKEN_TTL }, // 25 min
  );

  const refreshToken = signToken(
    { ...authenticatedUser, session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn:  process.env.REFRESH_TOKEN_TTL }, // 5 days
  );

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });
  
  return res.send(sessions);
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}


