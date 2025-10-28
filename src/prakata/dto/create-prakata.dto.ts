import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePrakataDto {
  @ApiProperty({
    description: 'Judul prakata',
    example: 'Selamat Datang di Aplikasi Kami',
  })
  @IsString()
  judul: string;

  @ApiProperty({
    description: 'Sub judul prakata (opsional)',
    example: 'Membangun Masa Depan Bersama',
    required: false,
  })
  @IsOptional()
  @IsString()
  sub_judul?: string | null;

  @ApiProperty({
    description: 'Isi prakata dalam bentuk teks',
    example: 'Kami sangat senang menyambut Anda di aplikasi ini...',
  })
  @IsString()
  isi: string;

  @ApiProperty({
    description: 'Penutup prakata (opsional)',
    example: 'Terima kasih atas perhatian Anda.',
    required: false,
  })
  @IsOptional()
  @IsString()
  penutup?: string | null;
}
