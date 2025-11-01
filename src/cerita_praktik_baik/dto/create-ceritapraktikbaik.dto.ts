import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateCeritaPraktikBaikDto {
  @ApiProperty({
    description: 'Judul ceritapraktikbaik',
    example: 'Pengumuman Libur Sekolah',
  })
  @IsString()
  judul: string;

  @ApiProperty({
    description: 'Penulis cerita baik praktik',
    example: 'Naufal',
  })
  @IsString()
  penulis: string;

  @ApiProperty({
    description:
      'Isi cerita baik praktik dalam bentuk HTML (boleh <img src="data:...">)',
    example:
      '<p>Libur sekolah mulai 1 Januari 2024.</p><img src="data:image/png;base64,iVBOR..." />',
  })
  @IsString()
  isi: string;
}

export class CreateCeritaPraktikBaikGambarDto {
  @ApiProperty({
    description: 'Gambar cerita baik praktik (disimpan ke bucket)',
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

export class CreateCeritaPraktikBaikWithGambarDto extends CreateCeritaPraktikBaikDto {
  @ApiProperty({
    description:
      'Daftar gambar luar (bukan inline HTML), disimpan ke tabel ceritapraktikbaik_gambar + bucket',
    type: [CreateCeritaPraktikBaikGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCeritaPraktikBaikGambarDto)
  cerita_praktik_baik_gambar?: CreateCeritaPraktikBaikGambarDto[];
}
