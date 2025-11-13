import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStrukturOrganisasiDto {
  @ApiPropertyOptional({
    description: 'URL atau nama file gambar struktur organisasi',
  })
  @IsOptional()
  @IsString()
  gambar_struktur?: string;

  @ApiPropertyOptional({
    description: 'URL atau nama file gambar dokumentasi terkait',
  })
  @IsOptional()
  @IsString()
  gambar_dokumentasi?: string;
}
