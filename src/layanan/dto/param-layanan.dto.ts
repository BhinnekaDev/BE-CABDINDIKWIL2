import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class ParamLayananDto {
  @ApiPropertyOptional({
    description: 'Filter berdasarkan ID layanan',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idParam?: number;

  @ApiPropertyOptional({
    description: 'Tanggal mulai (ISO Format)',
    example: '2025-11-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Tanggal sampai (ISO Format)',
    example: '2025-11-15T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
