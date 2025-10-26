import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSatpenLocationDto {
  @ApiProperty({
    description: 'Kelurahan satuan pendidikan',
    example: 'Kelurahan 2',
  })
  @IsString()
  kelurahan: string;

  @ApiProperty({
    description: 'Kecamatan satuan pendidikan',
    example: 'Kecamatan 2',
  })
  @IsString()
  kecamatan: string;

  @ApiProperty({
    description: 'Kabupaten satuan pendidikan',
    example: 'Kabupaten 2',
  })
  @IsString()
  kabupaten: string;

  @ApiProperty({
    description: 'Provinsi satuan pendidikan',
    example: 'Provinsi 2',
  })
  @IsString()
  provinsi: string;
}
