import { Module } from '@nestjs/common';
import { SatpenService } from './satpen.service';
import { SatpenController } from './satpen.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';

@Module({
  imports: [SupabaseModule],
  controllers: [SatpenController],
  providers: [SatpenService, SupabaseService, JwtAuthGuard],
})
export class SatpenModule {}
