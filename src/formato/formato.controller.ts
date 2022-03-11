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
import { CreateFormatoDto } from './dto/createFormato.dto';
import { UpdateFormatoDto } from './dto/updateFormato.dto';
import { Formato } from './entities/formato.entity';
import { TransformInterceptor } from 'src/core/interceptors/Transform.interceptor';
import { OutputFormatoDto } from './dto/outputFormato.dto';

@Controller('formato')
@UseInterceptors(new TransformInterceptor(OutputFormatoDto))
export class FormatoController {
  constructor(private readonly service: FormatoService) {}

  @Post()
  async create(@Body() createFormatoDto: CreateFormatoDto): Promise<Formato> {
    return await this.service.create(createFormatoDto);
  }

  @Get()
  async findAll(): Promise<Formato[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Formato> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormatoDto: UpdateFormatoDto,
  ): Promise<Formato> {
    return this.service.update(id, updateFormatoDto);
  }
}
