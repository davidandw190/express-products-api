import { FilterQuery } from 'mongoose';
import { SessionDocument, SessionModel } from '../model/session.model';
import { verifyToken } from '../utils/jwt.utils';
import { get } from 'lodash';

export async function createSession(userId: string, userAgent: string): Promise<SessionDocument> {
  const createdSession = await SessionModel.create({
    user: userId,
    userAgent: userAgent,
  });

  return createdSession.toJSON();
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
  const { decoded } = verifyToken(refreshToken, 'refreshTokenPublicKey');

  if (!decoded || !get(decoded, "session")) return false;

  // TODO
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}
