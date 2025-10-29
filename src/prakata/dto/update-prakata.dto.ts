import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePrakataDto {
  @ApiPropertyOptional({
    description: 'Judul prakata',
    example: 'Perubahan Judul Prakata',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Sub judul prakata (opsional)',
    example: 'Sub judul terbaru',
    required: false,
  })
  @IsOptional()
  @IsString()
  sub_judul?: string | null;

  @ApiPropertyOptional({
    description: 'Isi prakata dalam bentuk teks',
    example: 'Isi prakata terbaru...',
  })
  @IsOptional()
  @IsString()
  isi?: string;

  @ApiPropertyOptional({
    description: 'Penutup prakata (opsional)',
    example: 'Penutup terbaru.',
    required: false,
  })
  @IsOptional()
  @IsString()
  penutup?: string | null;
}
