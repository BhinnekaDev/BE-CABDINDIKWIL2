import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class FilterSpmbDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan judul',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan link text',
  })
  @IsOptional()
  @IsString()
  link_text?: string;

  @ApiPropertyOptional({
    description: 'Filter tanggal dibuat (YYYY atau YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  dibuat_pada?: string;
}
