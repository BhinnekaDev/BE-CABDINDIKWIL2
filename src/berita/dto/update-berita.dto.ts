import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateBeritaDto {
  @ApiPropertyOptional({
    description: 'Judul berita',
    example: 'Perubahan Jadwal Libur Sekolah',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Penulis berita',
    example: 'Admin sekolah',
  })
  @IsOptional()
  @IsString()
  penulis?: string;

  @ApiPropertyOptional({
    description: 'Isi berita dalam bentuk HTML (boleh <img src="data:...">)',
    example: '<p>Isi berita terbaru...</p>',
  })
  @IsOptional()
  @IsString()
  isi?: string;
}

export class UpdateBeritaGambarDto {
  @ApiPropertyOptional({
    description:
      'Gambar baru (base64) / data URL untuk replacement atau tambahan',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsOptional()
  @IsString()
  url_gambar?: string;

  @ApiPropertyOptional({
    description: 'Keterangan gambar',
    example: 'Suasana Acara Upacara',
    required: false,
  })
  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class UpdateBeritaWithGambarDto extends UpdateBeritaDto {
  @ApiPropertyOptional({
    description:
      'Daftar gambar berita (jika dikirim dianggap update/replace/tambah)',
    type: [UpdateBeritaGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBeritaGambarDto)
  url_gambar?: UpdateBeritaGambarDto[];
}
