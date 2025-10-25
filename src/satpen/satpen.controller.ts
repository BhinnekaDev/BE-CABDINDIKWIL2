import { SatpenService } from './satpen.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { FilterSatpenDto } from './dto/filter-satpen.dto';

@ApiTags('Satpen')
@Controller('satpen')
export class SatpenController {
  constructor(private readonly satpenService: SatpenService) {}

  @Get('all')
  @ApiResponse({ status: 200, description: 'Get all satuan pendidikan' })
  async getAll() {
    return await this.satpenService.getAllSatpen();
  }

  @Get('filtered')
  async getFilteredSatpen(@Query() filterDto: FilterSatpenDto) {
    return this.satpenService.getFilteredSatpen(filterDto);
  }
}
