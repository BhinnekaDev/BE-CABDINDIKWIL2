import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ParamBeritaDto {
  @ApiProperty({
    description: 'ID berita',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  idParam: number;
}
