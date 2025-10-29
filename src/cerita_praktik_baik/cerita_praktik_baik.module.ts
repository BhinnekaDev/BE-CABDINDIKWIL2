import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CeritaPraktikBaikController } from './cerita_praktik_baik.controller';
import { CeritaPraktikBaikService } from './cerita_praktik_baik.service';

@Module({
  imports: [SupabaseModule],
  providers: [CeritaPraktikBaikService, SupabaseService, JwtAuthGuard],
  controllers: [CeritaPraktikBaikController],
})
export class CeritaPraktikBaikModule {}
