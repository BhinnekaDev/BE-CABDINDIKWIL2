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
    description: 'Nama Jalan',
    example: 'Jalan-jalan',
  })
  @IsString()
  alamat: string;
}
