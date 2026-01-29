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
    
    // Store user ID in session
    req.session.userId = user.id;
    
    // Redirect to the Frontend with user ID in URL
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    res.redirect(`${frontendUrl}/dashboard/${user.id}`);
  }

  // 3. Logout Route
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  }

  // 4. Check auth status
  @Get('me')
  async getMe(@Req() req) {
    if (!req.session || !req.session.userId) {
      return { authenticated: false };
    }
    const user = await this.authService.findUserById(req.session.userId);
    return { authenticated: true, user };
  }
}
