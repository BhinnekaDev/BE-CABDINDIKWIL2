import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStrukturOrganisasiDto {
  @ApiProperty({ description: 'URL atau nama file gambar struktur organisasi' })
  @IsString()
  gambar_struktur: string;

  @ApiProperty({ description: 'URL atau nama file gambar dokumentasi terkait' })
  @IsString()
  gambar_dokumentasi: string;
}
