import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ParamSeputarCabdinDto {
  @ApiProperty({
    description: 'ID seputar cabdin',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
