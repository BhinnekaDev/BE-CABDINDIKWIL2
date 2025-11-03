import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminManagementController } from './admin-management.controller';
import { AdminManagementService } from './admin-management.service';

@Module({
  imports: [SupabaseModule],
  providers: [AdminManagementService, SupabaseService, JwtAuthGuard],
  controllers: [AdminManagementController],
})
export class AdminManagementModule {}
