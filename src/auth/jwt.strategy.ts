import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AwsCognitoConfig } from '../aws/aws-cognito.config';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(authConfig: AwsCognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      audience: authConfig.clientId,

      issuer: authConfig.authority,

      algorithms: ['RS256'],

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  public async validate(payload: any) {
    console.log(`payload: ${JSON.stringify(payload)}`);

    return { idUsuario: payload.sub, email: payload.email };
  }
}
