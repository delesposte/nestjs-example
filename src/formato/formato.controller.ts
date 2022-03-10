import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { FormatoService } from './formato.service';
import { CreateFormatoDto } from './dto/create-formato.dto';
import { UpdateFormatoDto } from './dto/update-formato.dto';
import { Formato } from './entities/formato.entity';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';

@Controller('formato')
@UseInterceptors(new TransformInterceptor(CreateFormatoDto))
export class FormatoController {
  constructor(private readonly formatoService: FormatoService) {}

  @Post()
  async create(@Body() createFormatoDto: CreateFormatoDto): Promise<Formato> {
    return await this.formatoService.create(createFormatoDto);
  }

  @Get()
  findAll(): Promise<Formato[]> {
    return this.formatoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Formato> {
    return this.formatoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormatoDto: UpdateFormatoDto,
  ): Promise<Formato> {
    return this.formatoService.update(id, updateFormatoDto);
  }
}
