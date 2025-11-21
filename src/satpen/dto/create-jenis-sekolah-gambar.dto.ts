import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateJenisSekolahGambarDto {
  @ApiProperty({
    example: 3,
    description: 'ID Jenis Sekolah (3 = SMA, 4 = SMK, 10 = SLB)',
  })
  @IsInt()
  @IsNotEmpty()
  id_jenis: number;

  @ApiProperty({
    example:
      'https://your-supabase-bucket-url/storage/v1/object/public/jenis-sekolah/gambar1.png',
    description: 'URL gambar dari Supabase Storage (bukan base64)',
  })
  @IsUrl()
  @IsNotEmpty()
  url_gambar: string;
}
