import { AuthRequest } from './auth-request.interface';
import { SupabaseService } from '../../../supabase/supabase.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    if (!token) return false;

    try {
      const user = await this.supabaseService.getUser(token);
      request.user = user;
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('Unknown error', err);
      }
      return false;
    }
  }
}
