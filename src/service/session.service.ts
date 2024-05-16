import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { SessionDocument, SessionModel } from '../model/session.model';
import { signToken, verifyToken } from '../utils/jwt.utils';

import { findUser } from './user.service';
import { get } from 'lodash';

export async function createSession(userId: string, userAgent: string): Promise<SessionDocument> {
  try {
    const createdSession = await SessionModel.create({
      user: userId,
      userAgent: userAgent,
    });

    return createdSession.toJSON();
  } catch (error) {
    throw new Error('Unable to create session');
  }
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }): Promise<string | false> {
  try {
    const { decoded } = verifyToken(refreshToken, 'refreshTokenPublicKey');

    if (!decoded || !get(decoded, 'session')) {
      return false;
    }

    const session = await SessionModel.findById(decoded.session);

    if (!session || !session.isValid) {
      return false;
    }

    const user = await findUser({ _id: session.user });

    if (!user) {
      return false;
    }

    const accessToken = signToken(
      { ...user, session: session._id },
      'accessTokenPrivateKey',
      { expiresIn: process.env.ACCESS_TOKEN_TTL }, // 25 min
    );

    return accessToken;
  } catch (error) {
    throw new Error('Unable to re-issue access token');
  }
}

export async function updateSession(query: FilterQuery<SessionDocument>, data: UpdateQuery<SessionDocument>): Promise<void> {
  try {
    const result: UpdateWriteOpResult = await SessionModel.updateOne(query, data);

    if (result.modifiedCount === 0) {
      throw new Error('Session not found or not updated');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Unable to update session');
  }
}

export async function findSessions(query: FilterQuery<SessionDocument>): Promise<SessionDocument[]> {
  try {
    const sessions = await SessionModel.find(query).lean();
    return sessions;
  } catch (error) {
    throw new Error('Unable to find sessions');
  }
}
