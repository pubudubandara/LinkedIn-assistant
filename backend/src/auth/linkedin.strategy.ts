import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOption } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID')!,
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('LINKEDIN_REDIRECT_URI')!,
      scope: ['openid', 'profile', 'email'], // New Scopes ,w_member_social removed
      state: true,
      passReqToCallback: false,
      skipUserProfile: true, // Stop getting data from the library (because it's outdated)
    } as StrategyOption & { state: boolean; skipUserProfile: boolean });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      // 1. Get User Info
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;
      
      // --- DEBUG START ---
      console.log('====================================');
      console.log('LINKEDIN OIDC RESPONSE:', data);
      console.log('====================================');
      // --- DEBUG END ---

      const user = {
        linkedinId: data.sub,
        firstName: data.given_name,
        lastName: data.family_name,
        email: data.email,
        // In OIDC, the image comes under the name 'picture'
        picture: data.picture || null, 
        headline: '', // Headline is not available through OIDC (see details below)
        accessToken,
        refreshToken,
        expiresIn: 3600 * 24 * 60,
      };

      done(null, user);
    } catch (error) {
      console.error('LinkedIn Error:', error.response?.data || error.message);
      done(new UnauthorizedException('Failed to fetch LinkedIn profile'), false);
    }
  }
}