import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateCeritaPraktikBaikDto {
  @ApiPropertyOptional({
    description: 'Judul cerita baik praktik',
    example: 'Perubahan Jadwal Libur Sekolah',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Penulis cerita baik praktik',
    example: 'Admin sekolah',
  })
  @IsOptional()
  @IsString()
  penulis?: string;

  @ApiPropertyOptional({
    description:
      'Isi cerita baik praktik dalam bentuk HTML (boleh <img src="data:...">)',
    example: '<p>Isi cerita baik praktik terbaru...</p>',
  })
  @IsOptional()
  @IsString()
  isi?: string;
}

export class UpdateCeritaPraktikBaikGambarDto {
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

export class UpdateCeritaPraktikBaikWithGambarDto extends UpdateCeritaPraktikBaikDto {
  @ApiPropertyOptional({
    description:
      'Daftar gambar cerita baik praktik (jika dikirim dianggap update/replace/tambah)',
    type: [UpdateCeritaPraktikBaikGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCeritaPraktikBaikGambarDto)
  cerita_praktik_baik_gambar?: UpdateCeritaPraktikBaikGambarDto[];
}
