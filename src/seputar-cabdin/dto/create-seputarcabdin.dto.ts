import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateSeputarCabdinDto {
  @ApiProperty({
    description: 'Judul seputarcabdin',
    example: 'Pengumuman Libur Sekolah',
  })
  @IsString()
  judul: string;

  @ApiProperty({
    description: 'Penulis seputar cabdin',
    example: 'Naufal',
  })
  @IsString()
  penulis: string;

  @ApiProperty({
    description:
      'Isi seputar Cabdin dalam bentuk HTML (boleh <img src="data:...">)',
    example:
      '<p>Libur sekolah mulai 1 Januari 2024.</p><img src="data:image/png;base64,iVBOR..." />',
  })
  @IsString()
  isi: string;
}

export class CreateSeputarCabdinGambarDto {
  @ApiProperty({
    description: 'Gambar seputar Cabdin (disimpan ke bucket)',
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

export class CreateSeputarCabdinWithGambarDto extends CreateSeputarCabdinDto {
  @ApiProperty({
    description:
      'Daftar gambar luar (bukan inline HTML), disimpan ke tabel seputarcabdin_gambar + bucket',
    type: [CreateSeputarCabdinGambarDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeputarCabdinGambarDto)
  seputar_cabdin_gambar?: CreateSeputarCabdinGambarDto[];
}
