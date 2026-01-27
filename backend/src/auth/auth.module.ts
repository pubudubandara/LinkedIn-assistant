import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LinkedInStrategy } from './linkedin.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LinkedInAccount } from '../entities/linkedin-account.entity';
import { OAuthToken } from '../entities/oauth-token.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, LinkedInAccount, OAuthToken]),
    PassportModule,
  ],
  providers: [AuthService, LinkedInStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
