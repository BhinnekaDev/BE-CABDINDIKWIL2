import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateFooterDto {
  @ApiProperty({
    description: 'Alamat email yang ditampilkan di footer',
    example: 'info@perusahaan.com',
  })
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string;

  @ApiProperty({
    description: 'Nomor telepon yang ditampilkan di footer',
    example: '+62 812 3456 7890',
  })
  @IsString({ message: 'No telepon harus berupa teks' })
  @IsNotEmpty({ message: 'No telepon wajib diisi' })
  no_telp: string;

  @ApiProperty({
    description: 'Alamat lengkap yang ditampilkan di footer',
    example: 'Jl. Merdeka No. 10, Jakarta Pusat, Indonesia',
  })
  @IsString({ message: 'Alamat harus berupa teks' })
  @IsNotEmpty({ message: 'Alamat wajib diisi' })
  alamat: string;
}
