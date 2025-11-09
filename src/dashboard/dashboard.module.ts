import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SupabaseModule],
  providers: [DashboardService, SupabaseService, JwtAuthGuard],
  controllers: [DashboardController],
})
export class DashboardModule {}
