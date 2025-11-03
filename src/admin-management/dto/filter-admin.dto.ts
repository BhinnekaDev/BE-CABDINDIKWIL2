import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RoleEnum {
  Admin = 'Admin',
  Superadmin = 'Superadmin',
}

export enum StatusApprovalEnum {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export class FilterAdminDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan peran admin',
    enum: RoleEnum,
    example: RoleEnum.Admin,
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan status persetujuan admin',
    enum: StatusApprovalEnum,
    example: StatusApprovalEnum.Approved,
  })
  @IsOptional()
  @IsEnum(StatusApprovalEnum)
  status_approval?: StatusApprovalEnum;

  @ApiPropertyOptional({
    description: 'Cari admin berdasarkan email (mendukung pencarian sebagian)',
    example: 'fifanaufal10@gmail.com',
  })
  @IsOptional()
  @IsString()
  email?: string;
}
