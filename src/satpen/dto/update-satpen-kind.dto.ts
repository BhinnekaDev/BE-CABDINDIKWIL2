import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSatpenKindDto {
  @ApiProperty({
    description: 'Jenis satuan pendidikan',
    example: 'Universitas',
  })
  @IsString()
  namaJenis: string;
}
