import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SatpenModule } from './satpen/satpen.module';
import { BeritaModule } from './berita/berita.module';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [AuthModule, SatpenModule, BeritaModule],
})
export class AppModule {}
