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

import { SpmbService } from './spmb.service';

import { FilterSpmbDto } from './dto/filter-spmb.dto';
import { ParamSPMBDto } from './dto/param-spmb.dto';
import { CreateSPMBDto } from './dto/create-spmb.dto';
import { UpdateSPMBDto } from './dto/update-spmb.dto';

@Controller('spmb')
export class SpmbController {
  constructor(private readonly spmbService: SpmbService) {}

  /**
   * Get all SPMB
   *
   * @returns All SPMB
   */
  @Get()
  async getAll() {
    return await this.spmbService.getAllSpmb();
  }

  /**
   * Get SPMB with filters
   *
   * @param {FilterSpmbDto} filterDto
   * @returns Filtered SPMB
   */
  @Get('filter')
  async getFiltered(@Query() filterDto: FilterSpmbDto) {
    return await this.spmbService.getFilteredSpmb(filterDto);
  }

  /**
   * Create new SPMB
   *
   * @param {Request} req
   * @param {CreateSPMBDto} createDto
   * @returns Created SPMB
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new SPMB' })
  async create(@Req() req: Request, @Body() createDto: CreateSPMBDto) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.spmbService.createSPMB(userJwt, createDto);
  }

  /**
   * Update existing SPMB
   *
   * @param {Request} req
   * @param {ParamSPMBDto} paramDto
   * @param {UpdateSPMBDto} updateDto
   * @returns Updated SPMB
   * @throws {BadRequestException} If SPMB ID is not provided
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update existing SPMB' })
  async update(
    @Req() req: Request,
    @Query() paramDto: ParamSPMBDto,
    @Body() updateDto: UpdateSPMBDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.spmbService.updateSPMB(userJwt, paramDto, updateDto);
  }

  /**
   * Delete SPMB by ID
   *
   * @param {Request} req
   * @param {ParamSPMBDto} paramDto
   * @returns Deleted SPMB
   * @throws {BadRequestException} If SPMB ID is not provided
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete SPMB by ID' })
  async delete(@Req() req: Request, @Query() paramDto: ParamSPMBDto) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.spmbService.deleteSPMB(userJwt, paramDto);
  }
}
