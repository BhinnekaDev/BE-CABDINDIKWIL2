import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSatpenKindDto {
  @ApiProperty({
    description: 'Jenis satuan pendidikan',
    example: 'SLB',
  })
  @IsString()
  namaJenis: string;
}
