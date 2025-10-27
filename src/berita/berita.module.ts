import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BeritaController } from './berita.controller';
import { BeritaService } from './berita.service';

@Module({
  imports: [SupabaseModule],
  providers: [BeritaService, SupabaseService, JwtAuthGuard],
  controllers: [BeritaController],
})
export class BeritaModule {}
