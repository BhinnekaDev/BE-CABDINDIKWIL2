import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ParamJenisSekolahGambarDto {
  @ApiPropertyOptional({
    example: 12,
    description: 'ID record gambar jenis sekolah (opsional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idParam?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID jenis sekolah (SMA/SMK/SLB), opsional',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_jenis?: number;
}
