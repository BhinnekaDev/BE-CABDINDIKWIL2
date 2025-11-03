import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSatpenLocationDto {
  @ApiProperty({
    description: 'Kelurahan satuan pendidikan',
    example: 'Kelurahan 2',
  })
  @IsString()
  kelurahan: string;

  @ApiProperty({
    description: 'nama jalan',
    example: 'jalan-jalan',
  })
  @IsString()
  alamat: string;
}
