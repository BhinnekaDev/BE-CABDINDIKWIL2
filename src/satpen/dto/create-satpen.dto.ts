import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateSatpenDto {
  @ApiProperty({
    description: 'NPSN satuan pendidikan',
    example: 2002,
  })
  @IsNumber()
  npsn: number;

  @ApiProperty({
    description: 'Nama satuan pendidikan',
    example: 'SD Negeri 1 Jakarta',
  })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({
    description: 'ID jenis sekolah (referensi ke tabel jenis_sekolah)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  jenis_id: number;

  @ApiProperty({
    description: 'Status satuan pendidikan',
    example: 'Swasta',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Alamat satuan pendidikan',
    example: 'Jl. Merdeka No.1, Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiProperty({
    description: 'ID lokasi (referensi ke tabel lokasi)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lokasi_id?: number;
}
