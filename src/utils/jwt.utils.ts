import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

import { TokenKey } from '../enums/token-key.enum';
import { log } from './logger.utils';

const ALGORITHM = 'RS256';

/**
 * Signs a JWT token with the specified payload and private key.
 * @param payload The payload to include in the JWT token.
* @param keyName The enum representing the environment variable containing the private key.
 * @param options Optional signing options.
 * @returns The signed JWT token.
 */
export function signToken(
  payload: object,
  keyName: TokenKey,
  options?: jwt.SignOptions,
): string {
  const signingKey = Buffer.from(process.env[keyName] || '', 'base64').toString('ascii');

  const signOptions: SignOptions = {
    ...(options || {}),
    algorithm: ALGORITHM,
  };

  return jwt.sign(payload, signingKey, signOptions);
}

/**
 * Verifies a JWT token with the specified public key.
 * @param token The JWT token to verify.
 * @param keyName The enum representing the environment variable containing the public key.
 * @returns An object indicating whether the token is valid, expired, and the decoded payload if valid.
 */
export function verifyToken(
  token: string,
  keyName: TokenKey,
): { valid: boolean; expired: boolean; decoded: any | null } {
  const publicKey = Buffer.from(process.env[keyName] || '', 'base64').toString('ascii');

  const verifyOptions: VerifyOptions = {
    algorithms: [ALGORITHM],
  };

  try {
    const decoded = jwt.verify(token, publicKey, verifyOptions);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    log.error('Failed to verify JWT token:', error);

    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null,
    };
  }
}
