import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    console.log('Session check:', {
      sessionExists: !!request.session,
      userId: request.session?.userId,
      sessionID: request.sessionID
    });
    
    // Check if user exists in session
    if (!request.session || !request.session.userId) {
      throw new UnauthorizedException('You must be logged in to access this resource');
    }
    
    return true;
  }
}
