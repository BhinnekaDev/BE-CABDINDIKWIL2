import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BeritaModule } from './berita/berita.module';
import { SatpenModule } from './satpen/satpen.module';
import { PrakataModule } from './prakata/prakata.module';
import { SeputarCabdinModule } from './seputar-cabdin/seputar-cabdin.module';
import { CeritaPraktikBaikModule } from './cerita_praktik_baik/cerita_praktik_baik.module';
import { InovasiModule } from './inovasi/inovasi.module';
import { AdminManagementModule } from './admin-management/admin-management.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FooterModule } from './footer/footer.module';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [AuthModule, SatpenModule, BeritaModule, PrakataModule, SeputarCabdinModule, CeritaPraktikBaikModule, InovasiModule, AdminManagementModule, DashboardModule, FooterModule],
})
export class AppModule {}
