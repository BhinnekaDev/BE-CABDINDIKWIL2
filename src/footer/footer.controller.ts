import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FooterService } from './footer.service';

import { ParamFooterDto } from './dto/param-footer.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';

@ApiTags('Footer')
@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  /*
   * Get Footer By ID or Get All Footer
   * @param {ParamFooterDto} params
   * @return {Promise<Footer[] | Footer>}
   */
  @Get()
  @ApiOperation({ summary: 'Get footer' })
  async getFooter(@Query() params?: ParamFooterDto) {
    return await this.footerService.getFooter(params);
  }

  /*
   * Update Footer
   * @param {UpdateFooterDto}
   * @param {ParamFooterDto} params
   * @return {Promise<Footer>}
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update footer' })
  async updateFooter(
    @Req() req: Request,
    @Body() updateFooterDto: UpdateFooterDto,
    @Query() params: ParamFooterDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.footerService.updateFooter(
      userJwt,
      params,
      updateFooterDto,
    );
  }
}
