import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  nama: string;

  @ApiProperty({
    description: 'ID jenis sekolah (referensi ke tabel jenis_sekolah)',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  jenis_id: number;

  @ApiProperty({
    description: 'Status satuan pendidikan',
    example: 'Negeri',
  })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({
    description: 'Jumlah siswa di satuan pendidikan',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  jumlah_siswa: number;

  @ApiProperty({
    description: 'Tautan ke halaman sekolah',
    example: 'https://example.com/sekolah',
  })
  @IsString()
  @IsOptional()
  tautan_sekolah: string;

  @ApiProperty({
    description: 'ID lokasi (referensi ke tabel lokasi)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lokasi_id?: number;
}
