import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InovasiController } from './inovasi.controller';
import { InovasiService } from './inovasi.service';

@Module({
  imports: [SupabaseModule],
  providers: [InovasiService, SupabaseService, JwtAuthGuard],
  controllers: [InovasiController],
})
export class InovasiModule {}
