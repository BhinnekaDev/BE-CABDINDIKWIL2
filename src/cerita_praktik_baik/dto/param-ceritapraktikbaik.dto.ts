import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ParamCeritaPraktikBaikDto {
  @ApiProperty({
    description: 'ID cerita baik praktik',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
