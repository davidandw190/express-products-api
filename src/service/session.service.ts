import { FilterQuery } from 'mongoose';
import { SessionDocument, SessionModel } from '../model/session.model';
import { signToken, verifyToken } from '../utils/jwt.utils';
import { get } from 'lodash';
import { findUser } from './user.service';
import config from 'config';

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
      { expiresIn: config.get('ACCESS_TOKEN_TTL') }, // 25 min
    );

    return accessToken;
  } catch (error) {
    throw new Error('Unable to re-issue access token');
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
