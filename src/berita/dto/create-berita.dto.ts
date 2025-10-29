import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateBeritaDto {
  @ApiProperty({
    description: 'Judul berita',
    example: 'Pengumuman Libur Sekolah',
  })
  @IsString()
  judul: string;

  @ApiProperty({
    description: 'Penulis berita',
    example: 'Naufal',
  })
  @IsString()
  penulis: string;

  @ApiProperty({
    description: 'Isi berita dalam bentuk HTML (boleh <img src="data:...">)',
    example:
      '<p>Libur sekolah mulai 1 Januari 2024.</p><img src="data:image/png;base64,iVBOR..." />',
  })
  @IsString()
  isi: string;
}

export class CreateBeritaGambarDto {
  @ApiProperty({
    description: 'Gambar berita (disimpan ke bucket)',
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

export class CreateBeritaWithGambarDto extends CreateBeritaDto {
  @ApiProperty({
    description:
      'Daftar gambar luar (bukan inline HTML), disimpan ke tabel berita_gambar + bucket',
    type: [CreateBeritaGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBeritaGambarDto)
  url_gambar?: CreateBeritaGambarDto[];
}
