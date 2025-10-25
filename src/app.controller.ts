import type { Response } from 'express';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiExcludeEndpoint()
  getLandingPage(@Res() res: Response) {
    const html = this.appService.getLandingPageHTML();
    res.type('text/html').send(html);
  }
}
