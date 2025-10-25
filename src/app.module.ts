import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
