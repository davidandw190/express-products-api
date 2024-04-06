import { FilterQuery } from 'mongoose';
import { SessionDocument, SessionModel } from '../model/session.model';

export async function createSession(userId: string, userAgent: string): Promise<SessionDocument> {
  const createdSession = await SessionModel.create({
    user: userId,
    userAgent: userAgent,
  });

  return createdSession.toJSON();
}
