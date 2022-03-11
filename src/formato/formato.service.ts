import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository, Equal, Not, FindConditions } from 'typeorm';
import { CreateFormatoDto } from './dto/createFormato.dto';
import { UpdateFormatoDto } from './dto/updateFormato.dto';
import { Formato } from './entities/formato.entity';

@Injectable()
export class FormatoService {

  constructor(
    @InjectRepository(Formato)
    private repository: Repository<Formato>
  ) { }

  private async validateDto(dto: object): Promise<void> {
    const validationError = await validate(dto);

    if (validationError && validationError.length > 0) {
      throw new BadRequestException('Formato is invalid');
    }
  }

  async create(dto: CreateFormatoDto): Promise<Formato> {
    await this.validateDto(dto);
    await this.validateDuplicateFormato(dto.formato);

    const entity = plainToClass(Formato, dto);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Formato[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Formato> {
    if (!id) {
      throw new BadRequestException();
    }

    const formato = await this.repository.findOne(id);

    if (!formato) {
      throw new NotFoundException();
    }

    return formato;
  }

  async update(id: string, dto: UpdateFormatoDto): Promise<Formato> {
    if (!id || !dto) {
      throw new BadRequestException();
    }

    await this.validateDto(dto);
    await this.validateDuplicateFormato(dto.formato, id);

    const entityToUpdate = plainToClass(Formato, dto);
    const updateResult = await this.repository.update(id, entityToUpdate);

    if (!updateResult || !updateResult.affected || updateResult.affected <= 0) {
      throw new NotFoundException();
    }

    const entitty = await this.repository.findOne(id);

    if (!entitty) {
      throw new NotFoundException();
    }

    return entitty;
  }

  private async validateDuplicateFormato(formato: string, id?: string): Promise<void> {
    const findConditions: FindConditions<Formato> = {
      formato: Equal(formato)
    };

    if (id) {
      findConditions.id = Not(id);
    }

    const entitiesFound = await this.repository.find(findConditions);

    if (entitiesFound && entitiesFound.length > 0) {
      throw new BadRequestException('Formato already exists');
    }
  }

}
