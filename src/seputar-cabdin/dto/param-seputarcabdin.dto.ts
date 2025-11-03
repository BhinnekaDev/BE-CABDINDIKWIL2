import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ParamSeputarCabdinDto {
  @ApiPropertyOptional({
    description: 'ID seputar cabdin',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idParam?: number;
}
