import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Alamat email pengguna yang valid',
    example: 'fifanaufal10@gmail.com',
  })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @ApiProperty({
    description: 'Kata sandi pengguna',
    example: 'Naufal123.',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password: string;
}
