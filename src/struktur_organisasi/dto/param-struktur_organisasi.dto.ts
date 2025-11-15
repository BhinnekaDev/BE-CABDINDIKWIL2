import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ParamStrukturOrganisasinDto {
  @ApiPropertyOptional({
    description: 'ID struktur organisasin',
    example: 15,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idParam?: number;
}
