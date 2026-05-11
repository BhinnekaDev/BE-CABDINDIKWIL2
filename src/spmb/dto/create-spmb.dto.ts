import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateSPMBMediaImageDto {
  @ApiProperty({
    description: 'URL gambar',
  })
  @IsString()
  @IsUrl()
  image_url: string;
}

export class CreateSPMBMediaFileDto {
  @ApiProperty({
    description: 'URL file',
  })
  @IsString()
  @IsUrl()
  file_url: string;
}

export class CreateSPMBDto {
  @ApiProperty({
    description: 'Judul SPMB',
  })
  @IsString()
  judul: string;

  @ApiPropertyOptional({
    description: 'Text link',
  })
  @IsOptional()
  @IsString()
  link_text?: string;

  @ApiPropertyOptional({
    description: 'URL link',
  })
  @IsOptional()
  @IsString()
  link_url?: string;

  @ApiPropertyOptional({
    type: [CreateSPMBMediaImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSPMBMediaImageDto)
  spmb_media_image?: CreateSPMBMediaImageDto[];

  @ApiPropertyOptional({
    type: [CreateSPMBMediaFileDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSPMBMediaFileDto)
  spmb_media_file?: CreateSPMBMediaFileDto[];
}
