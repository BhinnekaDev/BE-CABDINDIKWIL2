import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ParamPrakataDto {
  @ApiProperty({
    description: 'ID Prakata',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
