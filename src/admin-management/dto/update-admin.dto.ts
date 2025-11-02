import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum status_approval_enum {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export class UpdateAdminDto {
  @ApiPropertyOptional({
    description: 'Password lama (wajib jika ingin mengganti password)',
    example: 'oldPassword123',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  old_password?: string;

  @ApiPropertyOptional({
    description: 'Password baru minimal 6 karakter',
    example: 'newSecurePassword456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => (value === '' ? undefined : value))
  new_password?: string;

  @ApiPropertyOptional({
    description: 'Status persetujuan admin',
    enum: status_approval_enum,
    example: status_approval_enum.Approved,
  })
  @IsOptional()
  @IsEnum(status_approval_enum)
  status_approval?: status_approval_enum;
}
