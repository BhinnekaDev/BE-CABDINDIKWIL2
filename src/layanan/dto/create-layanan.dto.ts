import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { KindServices } from '../interface/layanan.inteface';

export class CreateLayananDto {
  @ApiProperty({ description: 'Judul layanan' })
  @IsString()
  judul: string;

  @ApiPropertyOptional({ description: 'Nama file terkait layanan' })
  @IsOptional()
  @IsString()
  nama_file?: string;

  @ApiPropertyOptional({ description: 'URL file terkait layanan' })
  @IsOptional()
  @IsString()
  url_file?: string;

  @ApiProperty({ description: 'Jenis layanan', enum: KindServices })
  @IsEnum(KindServices)
  jenis_layanan: KindServices;

  @IsString()
  jenis_file: string;

  @IsNumber()
  ukuran_file: number;
}
