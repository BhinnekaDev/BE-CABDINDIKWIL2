import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ParamFooterDto {
  @ApiPropertyOptional({
    description: 'ID footer',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idParam?: number;
}
