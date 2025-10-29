import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrakataController } from './prakata.controller';
import { PrakataService } from './prakata.service';

@Module({
  imports: [SupabaseModule],
  providers: [PrakataService, SupabaseService, JwtAuthGuard],
  controllers: [PrakataController],
})
export class PrakataModule {}
