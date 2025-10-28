import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { SupabaseService } from '../../supabase/supabase.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SeputarCabdinController } from './seputar-cabdin.controller';
import { SeputarCabdinService } from './seputar-cabdin.service';

@Module({
  imports: [SupabaseModule],
  providers: [SeputarCabdinService, SupabaseService, JwtAuthGuard],
  controllers: [SeputarCabdinController],
})
export class SeputarCabdinModule {}
