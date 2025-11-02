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
import { AdminManagementService } from './admin-management.service';

import { ParamAdminDto } from './dto/param-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin Management')
@Controller('admin-management')
export class AdminManagementController {
  constructor(
    private readonly adminManagementService: AdminManagementService,
  ) {}

  /**
   * Get all admins
   *
   * @param {string} userJwt
   * @return All admins
   */
  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Panggil Semua admin' })
  async getAllAdmins(@Req() req: Request) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.adminManagementService.getAllAdmins(userJwt);
  }

  /**
   * Get admin by id
   *
   * @param {string} userJwt
   * @param {ParamAdminDto} param
   * @return Admin by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Panggil admin berdasarkan ID' })
  async getAdminById(@Req() req: Request, @Query() params: ParamAdminDto) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.adminManagementService.getAdminById(userJwt, params);
  }

  /**
   * Update admin by ID
   *
   * @param {string} userJwt
   * @param {ParamAdminDto} param
   * @param {UpdateAdminDto} dto
   * @returns Updated admin
   * @throws {ForbiddenException | NotFoundException | InternalServerErrorException}
   */
  @Put('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update admin berdasarkan ID' })
  async updateAdminById(
    @Req() req: Request,
    @Query() params: ParamAdminDto,
    @Body() dto: UpdateAdminDto,
  ) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';
    return await this.adminManagementService.updateAdmin(userJwt, params, dto);
  }
}
