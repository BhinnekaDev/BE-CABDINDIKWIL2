import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCeritaPraktikBaikDto {
  @ApiPropertyOptional({
    description: 'Judul seputar cabdin',
    example: 'Pengumuman',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Penulis seputar cabdin',
    example: 'Naufal',
  })
  @IsOptional()
  @IsString()
  penulis?: string;

  @ApiPropertyOptional({
    description: 'Tanggal diterbitkan',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  tanggal_diterbitkan?: string;
}
