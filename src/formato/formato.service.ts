import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository, Equal, Not } from 'typeorm';
import { AssemblerFormato } from './dto/assembler-formato';
import { CreateFormatoDto } from './dto/create-formato.dto';
import { UpdateFormatoDto } from './dto/update-formato.dto';
import { Formato } from './entities/formato.entity';

@Injectable()
export class FormatoService {
  constructor(
    @InjectRepository(Formato)
    private formatoRepository: Repository<Formato>,
  ) {}

  async create(createFormatoDto: CreateFormatoDto): Promise<Formato> {
    const validationError = await validate(createFormatoDto);

    if (validationError && validationError.length > 0) {
      throw new BadRequestException('Format is invalid');
    }

    const entitiesFound = await this.formatoRepository.find({
      formato: createFormatoDto.formato,
    });

    if (entitiesFound && entitiesFound.length > 0) {
      throw new BadRequestException('Format already exists');
    }

    const entity = AssemblerFormato.assembly(createFormatoDto);
    return await this.formatoRepository.save(entity);
  }

  async findAll(): Promise<Formato[]> {
    return await this.formatoRepository.find();
  }

  async findOne(id: string): Promise<Formato> {
    if (!id) {
      throw new BadRequestException();
    }

    const formato = await this.formatoRepository.findOne(id);

    if (!formato) {
      throw new NotFoundException();
    }

    return formato;
  }

  async update(
    id: string,
    updateFormatoDto: UpdateFormatoDto,
  ): Promise<Formato> {
    if (!id || !updateFormatoDto) {
      throw new BadRequestException();
    }

    const validationError = await validate(updateFormatoDto);

    if (validationError && validationError.length > 0) {
      throw new BadRequestException('Format is invalid');
    }

    const entity = await this.formatoRepository.findOne(id);

    if (!entity) {
      throw new NotFoundException();
    }

    const entitiesFound = await this.formatoRepository.find({
      id: Not(id),
      formato: Equal(updateFormatoDto.formato),
    });

    if (entitiesFound && entitiesFound.length > 0) {
      throw new BadRequestException('Format already exists');
    }

    entity.formato = updateFormatoDto.formato;
    entity.ativo = updateFormatoDto.ativo;

    const updateResult = await this.formatoRepository.update(entity.id, entity);

    if (!updateResult || !updateResult.affected || updateResult.affected <= 0) {
      throw new NotFoundException();
    }

    return entity;
  }
}
