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
import { PrakataService } from './prakata.service';

import { CreatePrakataDto } from './dto/create-prakata.dto';
import { ParamPrakataDto } from './dto/param-prakata.dto';
import { UpdatePrakataDto } from './dto/update-prakata.dto';

@ApiTags('Prakata')
@Controller('prakata')
export class PrakataController {
  constructor(private readonly prakataService: PrakataService) {}

  /**
   * Get all prakata
   * @returns All prakata
   */
  @Get()
  async getAll() {
    return await this.prakataService.getAllPrakata();
  }

  /**
   * Create prakata
   * @returns Created prakata
   * @throws {UnauthorizedException}
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tambah prakata' })
  async createPrakata(
    @Req() req: Request,
    @Body() createPrakataDto: CreatePrakataDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.prakataService.createPrakata(userJwt, createPrakataDto);
  }

  /**
   * Update prakata by ID
   * @returns Updated prakata
   * @throws {UnauthorizedException, NotFoundException}
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update prakata' })
  async updatePrakata(
    @Req() req: Request,
    @Body() updatePrakataDto: UpdatePrakataDto,
    @Query() paramPrakataDto: ParamPrakataDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.prakataService.updatePrakata(
      userJwt,
      paramPrakataDto,
      updatePrakataDto,
    );
  }

  /**
   * Delete prakata by ID
   * @returns Deleted prakata
   * @throws {UnauthorizedException, NotFoundException}
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Hapus prakata' })
  async deletePrakata(
    @Req() req: Request,
    @Query() paramPrakataDto: ParamPrakataDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.prakataService.deletePrakata(userJwt, paramPrakataDto);
  }
}
