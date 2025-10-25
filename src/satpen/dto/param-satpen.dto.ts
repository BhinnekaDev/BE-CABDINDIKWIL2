import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamSatpenDto {
  @ApiProperty({
    description: 'NPSN satuan pendidikan',
    example: 2002,
  })
  @Type(() => Number)
  @IsNumber()
  npsnParam: number;
}
