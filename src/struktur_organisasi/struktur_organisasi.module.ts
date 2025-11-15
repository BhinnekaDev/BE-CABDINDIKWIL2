import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { StrukturOrganisasiController } from './struktur_organisasi.controller';
import { StrukturOrganisasiService } from './struktur_organisasi.service';

@Module({
  imports: [SupabaseModule],
  controllers: [StrukturOrganisasiController],
  providers: [StrukturOrganisasiService, SupabaseService, JwtAuthGuard],
})
export class StrukturOrganisasiModule {}
