import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSatpenLocationDto {
  @ApiProperty({
    description: 'Kelurahan satuan pendidikan',
    example: 'Kelurahan 1',
  })
  @IsString()
  kelurahan: string;

  @ApiProperty({
    description: 'Kecamatan satuan pendidikan',
    example: 'Kecamatan 1',
  })
  @IsString()
  kecamatan: string;

  @ApiProperty({
    description: 'Kabupaten satuan pendidikan',
    example: 'Kabupaten 1',
  })
  @IsString()
  kabupaten: string;

  @ApiProperty({
    description: 'Provinsi satuan pendidikan',
    example: 'Provinsi 1',
  })
  @IsString()
  provinsi: string;
}
