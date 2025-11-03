import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateInovasiDto {
  @ApiProperty({
    description: 'Judul inovasi',
    example: 'Pengumuman Libur Sekolah',
  })
  @IsString()
  judul: string;

  @ApiProperty({
    description: 'Penulis inovasi',
    example: 'Naufal',
  })
  @IsString()
  penulis: string;

  @ApiProperty({
    description: 'Isi inovasi dalam bentuk HTML (boleh <img src="data:...">)',
    example:
      '<p>Libur sekolah mulai 1 Januari 2024.</p><img src="data:image/png;base64,iVBOR..." />',
  })
  @IsString()
  isi: string;
}

export class CreateInovasiGambarDto {
  @ApiProperty({
    description: 'Gambar inovasi (disimpan ke bucket)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsString()
  url_gambar: string;

  @ApiProperty({
    description: 'Keterangan gambar (opsional)',
    example: 'Suasana Upacara Bendera',
    required: false,
  })
  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class CreateInovasiWithGambarDto extends CreateInovasiDto {
  @ApiProperty({
    description:
      'Daftar gambar luar (bukan inline HTML), disimpan ke tabel inovasi_gambar + bucket',
    type: [CreateInovasiGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInovasiGambarDto)
  inovasi_gambar?: CreateInovasiGambarDto[];
}
