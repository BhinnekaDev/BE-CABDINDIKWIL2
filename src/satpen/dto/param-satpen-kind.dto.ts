import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamSatpenKindDto {
  @ApiProperty({
    description: 'ID satuan jenis pendidikan',
    example: 9,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
