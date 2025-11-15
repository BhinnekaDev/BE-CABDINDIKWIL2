import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { LayananController } from './layanan.controller';
import { LayananService } from './layanan.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LayananController],
  providers: [LayananService, SupabaseService, JwtAuthGuard],
})
export class LayananModule {}
