import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateSatpenDto {
  @ApiProperty({
    description: 'NPSN satuan pendidikan',
    example: 2003,
  })
  @IsNumber()
  npsn: number;

  @ApiProperty({
    description: 'Nama satuan pendidikan',
    example: 'SD Negeri 2 Jakarta',
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
    example: 'Negeri',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Alamat satuan pendidikan',
    example: 'Jl. Merdeka No.2, Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiProperty({
    description: 'ID lokasi (referensi ke tabel lokasi)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lokasi_id?: number;
}
