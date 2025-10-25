import { supabase } from './supabase.client';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: supabase,
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
