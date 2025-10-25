import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Alamat email pengguna yang valid',
    example: 'fifanaufal10@gmail.com',
  })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Kata sandi minimal 6 karakter',
    example: 'Naufal123.',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({
    description: 'Nama lengkap pengguna',
    example: 'Naufal FIFA',
  })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  fullName: string;
}
