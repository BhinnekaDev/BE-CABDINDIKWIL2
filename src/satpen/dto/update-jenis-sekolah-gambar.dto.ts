import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUrl } from 'class-validator';

export class UpdateJenisSekolahGambarDto {
  @ApiPropertyOptional({
    example: 3,
    description:
      'ID jenis sekolah baru (opsional). Kosongkan jika tidak diubah.',
  })
  @IsOptional()
  @IsInt()
  id_jenis?: number;

  @ApiPropertyOptional({
    example:
      'https://your-project.supabase.co/storage/v1/object/public/satpen-icons/sma.png',
    description:
      'URL gambar baru. Jika berbeda dari URL lama, maka file lama di Storage akan dihapus.',
  })
  @IsOptional()
  @IsUrl()
  url_gambar?: string;
}
