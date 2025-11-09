import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum AdminRoleFilter {
  SUPERADMIN = 'Superadmin',
  ADMIN = 'Admin',
}

export class AdminFilterDto {
  @ApiPropertyOptional({
    enum: AdminRoleFilter,
    description: 'Filter berdasarkan role admin (Superadmin atau Admin)',
  })
  @IsOptional()
  @IsEnum(AdminRoleFilter, { message: 'role harus Superadmin atau Admin' })
  role?: AdminRoleFilter;
}
