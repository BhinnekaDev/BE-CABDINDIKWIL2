import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterSatpenDto {
  @ApiPropertyOptional({ description: 'Jenis sekolah', example: 'SMK' })
  @IsOptional()
  @IsString()
  jenis?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nama sekolah', example: 'SMK Negeri 1' })
  nama?: string;
}
