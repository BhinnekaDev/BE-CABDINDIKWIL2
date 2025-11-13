import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FooterService } from './footer.service';

import { CreateFooterDto } from './dto/create-footer.dto';
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
   * Create Footer
   * @param {CreateFooterDto} createFooterDto
   * @return {Promise<Footer>}
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create footer' })
  async createFooter(
    @Req() req: Request,
    @Body() createFooterDto: CreateFooterDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.footerService.createFooter(userJwt, createFooterDto);
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

  /*
   * Delete Footer
   * @param {ParamFooterDto} params
   * @return {Promise<Footer>}
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete footer' })
  async deleteFooter(@Req() req: Request, @Query() params: ParamFooterDto) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.footerService.deleteFooter(userJwt, params);
  }
}
