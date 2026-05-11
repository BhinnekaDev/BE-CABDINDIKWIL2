import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpmbService } from './spmb.service';
import { SpmbController } from './spmb.controller';

@Module({
  imports: [SupabaseModule],
  providers: [SpmbService, SupabaseService, JwtAuthGuard],
  controllers: [SpmbController],
})
export class SpmbModule {}
