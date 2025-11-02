import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ParamAdminDto {
  @ApiPropertyOptional({
    description: 'ID Admin',
    example: '15019655-5ee3-4e97-b07f-2741b034075d',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  id?: string;
}
