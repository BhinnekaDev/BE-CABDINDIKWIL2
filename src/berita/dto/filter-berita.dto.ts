import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBeritaDto {
  @ApiPropertyOptional({ description: 'Judul berita', example: 'Pengumuman' })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({ description: 'Penulis berita', example: 'Naufal' })
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
