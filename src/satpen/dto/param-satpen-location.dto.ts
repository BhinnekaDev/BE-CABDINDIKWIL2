import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamSatpenLocationDto {
  @ApiProperty({
    description: 'ID satuan lokasi pendidikan',
    example: 6,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
