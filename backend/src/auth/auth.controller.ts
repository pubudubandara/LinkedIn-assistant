import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // 1. Login Route
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin() {
    // Passport redirects to LinkedIn login page
  }

  // 2. Callback Route
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLoginCallback(@Req() req, @Res() res: Response) {
    // After validation by the strategy, user data is available in req.user
    const user = await this.authService.validateUser(req.user);
    
    // Redirect to the Frontend (Get Frontend URL from .env)
    // Example: http://localhost:3001/dashboard?userId=1
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    
    // For now, simply send the user ID as a query param (In production, use JWT Cookies)
    res.redirect(`${frontendUrl}/dashboard?id=${user.id}`);
  }
}
