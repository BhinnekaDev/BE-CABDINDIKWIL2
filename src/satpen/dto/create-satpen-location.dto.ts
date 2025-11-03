import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

  @ApiProperty({
    description: 'Nama Jalan',
    example: 'Jalan-jalan',
  })
  @IsString()
  nama_jalan: string;
}
