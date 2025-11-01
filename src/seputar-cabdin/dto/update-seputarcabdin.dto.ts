import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateSeputarCabdinDto {
  @ApiPropertyOptional({
    description: 'Judul seputar cabdin',
    example: 'Perubahan Jadwal Libur Sekolah',
  })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({
    description: 'Penulis seputar cabdin',
    example: 'Admin sekolah',
  })
  @IsOptional()
  @IsString()
  penulis?: string;

  @ApiPropertyOptional({
    description:
      'Isi seputar cabdin dalam bentuk HTML (boleh <img src="data:...">)',
    example: '<p>Isi seputar cabdin terbaru...</p>',
  })
  @IsOptional()
  @IsString()
  isi?: string;
}

export class UpdateSeputarCabdinGambarDto {
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

export class UpdateSeputarCabdinWithGambarDto extends UpdateSeputarCabdinDto {
  @ApiPropertyOptional({
    description:
      'Daftar gambar seputar cabdin (jika dikirim dianggap update/replace/tambah)',
    type: [UpdateSeputarCabdinGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSeputarCabdinGambarDto)
  seputar_cabdin_gambar?: UpdateSeputarCabdinGambarDto[];
}
