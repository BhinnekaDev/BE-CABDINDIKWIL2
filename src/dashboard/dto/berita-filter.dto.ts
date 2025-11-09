import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class BeritaFilterDto {
  @ApiPropertyOptional({
    example: 2025,
    description: 'Tahun tunggal untuk filter berita (opsional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'tahun harus berupa angka' })
  @Min(2000, { message: 'tahun must not be less than 2000' })
  tahun?: number;

  @ApiPropertyOptional({
    example: 2023,
    description: 'Tahun mulai range filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'tahunMulai must be an integer number' })
  @Min(2000, { message: 'tahunMulai must not be less than 2000' })
  tahunMulai?: number;

  @ApiPropertyOptional({
    example: 2025,
    description: 'Tahun akhir range filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'tahunAkhir must be an integer number' })
  @Min(2000, { message: 'tahunAkhir must not be less than 2000' })
  tahunAkhir?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Bulan mulai range filter (1–12)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'bulanMulai must be an integer number' })
  @Min(1, { message: 'bulanMulai must not be less than 1' })
  @Max(12, { message: 'bulanMulai must not be greater than 12' })
  bulanMulai?: number;

  @ApiPropertyOptional({
    example: 12,
    description: 'Bulan akhir range filter (1–12)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'bulanAkhir must be an integer number' })
  @Min(1, { message: 'bulanAkhir must not be less than 1' })
  @Max(12, { message: 'bulanAkhir must not be greater than 12' })
  bulanAkhir?: number;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Tanggal mulai filter (format YYYY-MM-DD)',
  })
  @IsOptional()
  tanggalMulai?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'Tanggal akhir filter (format YYYY-MM-DD)',
  })
  @IsOptional()
  tanggalAkhir?: string;
}
