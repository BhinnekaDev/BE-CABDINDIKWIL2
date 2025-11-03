import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateInovasiDto {
  @ApiPropertyOptional({
    description: 'Judul inovasi',
    example: 'Perubahan Jadwal Libur Sekolah',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Penulis inovasi',
    example: 'Admin sekolah',
  })
  @IsOptional()
  @IsString()
  penulis?: string;

  @ApiPropertyOptional({
    description: 'Isi inovasi dalam bentuk HTML (boleh <img src="data:...">)',
    example: '<p>Isi inovasi terbaru...</p>',
  })
  @IsOptional()
  @IsString()
  isi?: string;
}

export class UpdateInovasiGambarDto {
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

export class UpdateInovasiWithGambarDto extends UpdateInovasiDto {
  @ApiPropertyOptional({
    description:
      'Daftar gambar inovasi (jika dikirim dianggap update/replace/tambah)',
    type: [UpdateInovasiGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateInovasiGambarDto)
  inovasi_gambar?: UpdateInovasiGambarDto[];
}
