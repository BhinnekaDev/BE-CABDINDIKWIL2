import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateFooterDto } from './create-footer.dto';

export class UpdateFooterDto extends PartialType(CreateFooterDto) {
  @ApiPropertyOptional({
    description: 'Alamat email yang diperbarui',
    example: 'kontak@perusahaan.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email harus valid' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nomor telepon yang diperbarui',
    example: '+62 813 2222 3333',
  })
  @IsOptional()
  @IsString({ message: 'No telepon harus berupa teks' })
  no_telp?: string;

  @ApiPropertyOptional({
    description: 'Alamat baru untuk footer',
    example: 'Jl. Sudirman No. 15, Bandung, Indonesia',
  })
  @IsOptional()
  @IsString({ message: 'Alamat harus berupa teks' })
  alamat?: string;
}
