import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UpdateSPMBMediaImageDto {
  @ApiPropertyOptional({
    description: 'URL gambar',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  image_url?: string;
}

export class UpdateSPMBMediaFileDto {
  @ApiPropertyOptional({
    description: 'URL file',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  file_url?: string;
}

export class UpdateSPMBDto {
  @ApiPropertyOptional({
    description: 'Judul SPMB',
  })
  @IsOptional()
  @IsString()
  judul?: string;

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
    type: [UpdateSPMBMediaImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSPMBMediaImageDto)
  spmb_media_image?: UpdateSPMBMediaImageDto[];

  @ApiPropertyOptional({
    type: [UpdateSPMBMediaFileDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSPMBMediaFileDto)
  spmb_media_file?: UpdateSPMBMediaFileDto[];
}
