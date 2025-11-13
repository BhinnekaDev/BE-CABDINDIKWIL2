import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KindServices } from '../interface/layanan.inteface';

export class UpdateLayananDto {
  @ApiPropertyOptional({ description: 'Judul layanan' })
  @IsOptional()
  @IsString()
  judul?: string;

  @ApiPropertyOptional({ description: 'Nama file terkait layanan' })
  @IsOptional()
  @IsString()
  nama_file?: string;

  @ApiPropertyOptional({ description: 'URL file terkait layanan' })
  @IsOptional()
  @IsString()
  url_file?: string;

  @ApiPropertyOptional({ description: 'Jenis layanan', enum: KindServices })
  @IsOptional()
  @IsEnum(KindServices)
  jenis_layanan?: KindServices;
}
