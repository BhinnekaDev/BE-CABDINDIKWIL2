import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ParamInovasiDto {
  @ApiProperty({
    description: 'ID inovasi',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
