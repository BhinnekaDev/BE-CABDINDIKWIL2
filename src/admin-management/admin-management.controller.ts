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
   * Get all admins or specific admin by ID
   *
   * @param {string} userJwt
   * @param {ParamAdminDto} param
   * @returns adminData
   */
  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Panggil semua admin atau berdasarkan ID (opsional)',
  })
  async getAdmins(@Req() req: Request, @Query() params: ParamAdminDto) {
    const userJwt = req.headers.authorization?.split(' ')[1] || '';

    if (params.id) {
      return await this.adminManagementService.getAdminById(userJwt, params);
    } else {
      return await this.adminManagementService.getAllAdmins(userJwt);
    }
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
