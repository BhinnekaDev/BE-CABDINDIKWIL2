import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SekolahFilterDto {
  @ApiPropertyOptional({
    example: 'Negeri',
    description: 'Filter berdasarkan status sekolah (Negeri atau Swasta)',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 4,
    description:
      'Filter berdasarkan ID jenis sekolah (3 = SMA, 4 = SMK, 10 = SLB)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'jenis_id harus berupa angka (integer)' })
  jenis_id?: number;
}
