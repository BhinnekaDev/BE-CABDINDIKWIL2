import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { FooterController } from './footer.controller';
import { FooterService } from './footer.service';

@Module({
  imports: [SupabaseModule],
  controllers: [FooterController],
  providers: [FooterService, SupabaseService, JwtAuthGuard],
})
export class FooterModule {}
