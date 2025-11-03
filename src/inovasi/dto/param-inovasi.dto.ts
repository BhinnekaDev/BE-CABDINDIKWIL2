import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ParamInovasiDto {
  @ApiPropertyOptional({
    description: 'ID inovasi',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idParam?: number;
}
