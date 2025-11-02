import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class ParamAdminDto {
  @ApiProperty({
    description: 'ID Admin',
    example: '15019655-5ee3-4e97-b07f-2741b034075d',
  })
  @Type(() => String)
  @IsString()
  idParam: string;
}
