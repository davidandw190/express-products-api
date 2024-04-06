import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyToken } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

/**
 * Middleware to deserialize user from JWT tokens.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Next function to pass control to the next middleware.
 */
export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');
  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyToken(accessToken, 'accessTokenPublicKey');

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }

    const result = verifyToken(newAccessToken as string, 'accessTokenPublicKey');

    res.locals.user = result.decoded;
    return next();
  }

	return next();
};
