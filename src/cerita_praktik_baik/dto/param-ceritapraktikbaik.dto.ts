import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ParamCeritaPraktikBaikDto {
  @ApiPropertyOptional({
    description: 'ID cerita praktik baik',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idParam?: number;
}
