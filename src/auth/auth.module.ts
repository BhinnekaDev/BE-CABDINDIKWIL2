import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { SupabaseModule } from '@supabase/supabase.module';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SupabaseService } from '@supabase/supabase.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, JwtAuthGuard],
})
export class AuthModule {}
