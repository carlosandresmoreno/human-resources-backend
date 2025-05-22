import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService, // Make sure this is imported correctly
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET'); // Get the secret first

    // Crucially, check if jwtSecret is undefined and handle it
    if (!jwtSecret) {
      // This is a critical configuration error. The app cannot start without a JWT secret.
      throw new Error('JWT_SECRET environment variable is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Now TypeScript knows this is definitely a string
    });
  }

  async validate(payload: any) {
    // payload.sub typically holds the user ID
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found.');
    }
    // Return the user object, which will be attached to the request (req.user)
    return user;
  }
}