import { CreateFormatoDto } from '../formato/dto/create-formato.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Equal,
  FindConditions,
  FindOperator,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Formato } from './entities/formato.entity';
import { FormatoService } from './formato.service';
import { AssemblerFormato } from './dto/assembler-formato';

describe('FormatoService', () => {
  let service: FormatoService;
  let repository: Repository<Formato>;
  let formatoFakePDF: Formato;
  let formatoFakePNG: Formato;
  let formatoFakeJPEG: Formato;
  let formatosFake: Formato[];
  let updateResultAffectedOne: UpdateResult;
  let updateResultAffectedNone: UpdateResult;

  function findAll(): Formato[] {
    return formatosFake;
  }

  function findOneById(id: string): Formato {
    for (let i = 0; i < formatosFake.length; i++) {
      if (formatosFake[i].id === id) {
        return formatosFake[i];
      }
    }
    return;
  }

  function findByFormato(conditions: FindConditions<Formato>): Formato[] {
    return formatosFake.filter((formato) => {
      if (
        formato.id !== conditions.id &&
        formato.formato === conditions.formato
      ) {
        return formato;
      }
    });
  }

  function findExistingByOperators(
    conditions: FindConditions<Formato>,
  ): Formato[] {
    const id = conditions.id as FindOperator<string>;
    const formatoType = conditions.formato as FindOperator<string>;

    return formatosFake.filter((formato) => {
      if (formato.id !== id?.value && formato.formato === formatoType.value) {
        return formato;
      }
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormatoService,
        {
          provide: getRepositoryToken(Formato),
          useValue: {},
        },
      ],
    }).compile();

    formatoFakePDF = new Formato();
    formatoFakePDF.id = '11ec0719-459e-460e-b7d9-73a4012e5b11';
    formatoFakePDF.formato = 'pdf';
    formatoFakePDF.ativo = true;

    formatoFakePNG = new Formato();
    formatoFakePNG.id = '22ec0719-459e-460e-b7d9-73a4012e5b22';
    formatoFakePNG.formato = 'png';
    formatoFakePNG.ativo = true;

    formatoFakeJPEG = new Formato();
    formatoFakeJPEG.id = '33ec0719-459e-460e-b7d9-73a4012e5b33';
    formatoFakeJPEG.formato = 'jpeg';
    formatoFakeJPEG.ativo = true;

    updateResultAffectedOne = new UpdateResult();
    updateResultAffectedOne.affected = 1;

    updateResultAffectedNone = new UpdateResult();
    updateResultAffectedNone.affected = 0;

    formatosFake = [formatoFakePDF, formatoFakePNG];

    service = module.get<FormatoService>(FormatoService);
    repository = module.get<Repository<Formato>>(getRepositoryToken(Formato));
    repository.save = jest.fn().mockResolvedValue(formatoFakeJPEG);
    repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);
    repository.findOne = jest.fn().mockImplementation(findOneById);
    repository.find = jest.fn().mockImplementation(findOneById);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a formato', async () => {
      repository.find = jest.fn().mockImplementation(findByFormato);

      const formatoDto =
        AssemblerFormato.disassemblyToCreateFormatoDto(formatoFakeJPEG);

      const formato = await service.create(formatoDto);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        formato: formatoDto.formato,
      });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(formatoDto);
      expect(formato).toEqual(formatoFakeJPEG);
    });

    it('should return an error when trying to create a format that already exists', async () => {
      repository.find = jest.fn().mockImplementation(findByFormato);

      const formatoDto =
        AssemblerFormato.disassemblyToCreateFormatoDto(formatoFakePNG);

      await expect(service.create(formatoDto)).rejects.toThrow(
        new BadRequestException('Format already exists'),
      );

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        formato: formatoFakePNG.formato,
      });
      expect(repository.save).toHaveBeenCalledTimes(0);
    });

    it('should return an error when trying to create an invalid format', async () => {
      repository.find = jest.fn().mockImplementation(findByFormato);

      const formatoDto = new CreateFormatoDto();

      formatoDto.formato = undefined;
      await expect(service.create(formatoDto)).rejects.toThrow(
        new BadRequestException('Format is invalid'),
      );

      formatoDto.formato = null;
      await expect(service.create(formatoDto)).rejects.toThrow(
        new BadRequestException('Format is invalid'),
      );

      formatoDto.formato = '';
      await expect(service.create(formatoDto)).rejects.toThrow(
        new BadRequestException('Format is invalid'),
      );

      expect(repository.find).toHaveBeenCalledTimes(0);
      expect(repository.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update a formato', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);
      formatoFakePDF.ativo = false;
      formatoFakePDF.formato = 'txt';

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePDF);
      const formato = await service.update(formatoFakePDF.id, formatoDto);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(formatoFakePDF.id);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        id: Not(formatoFakePDF.id),
        formato: Equal(formatoDto.formato),
      });
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(
        formatoFakePDF.id,
        formatoFakePDF,
      );
      expect(formato).toEqual(formatoFakePDF);
    });

    it('should return an error when trying to update to a formato that does not exists', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePNG);

      await expect(
        service.update('id-inexistente', formatoDto),
      ).rejects.toThrow(new NotFoundException());

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledTimes(0);
      expect(repository.update).toHaveBeenCalledTimes(0);
    });

    it('should return an error when trying to update to a formato that already exists', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePNG);
      formatoDto.formato = formatoFakePDF.formato; /*Formato já existente*/

      await expect(
        service.update(formatoFakePNG.id, formatoDto),
      ).rejects.toThrow(new BadRequestException('Format already exists'));

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(formatoFakePNG.id);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        id: Not(formatoFakePNG.id),
        formato: Equal(formatoDto.formato),
      });
      expect(repository.update).toHaveBeenCalledTimes(0);
    });

    it('should return an error when the update does not affect anything', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedNone);

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePDF);

      await expect(
        service.update(formatoFakePDF.id, formatoDto),
      ).rejects.toThrow(new NotFoundException());

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(formatoFakePDF.id);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        id: Not(formatoFakePDF.id),
        formato: Equal(formatoDto.formato),
      });
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should return an error when not finding a formato to update', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);

      await expect(service.update(formatoFakePDF.id, null)).rejects.toThrow(
        new BadRequestException(),
      );

      await expect(
        service.update(formatoFakePDF.id, undefined),
      ).rejects.toThrow(new BadRequestException());

      expect(repository.findOne).toHaveBeenCalledTimes(0);
      expect(repository.find).toHaveBeenCalledTimes(0);
      expect(repository.update).toHaveBeenCalledTimes(0);
    });

    it('should return an error when not finding an formato id to update', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePDF);

      await expect(service.update('', formatoDto)).rejects.toThrow(
        new BadRequestException(),
      );

      await expect(service.update(null, formatoDto)).rejects.toThrow(
        new BadRequestException(),
      );

      await expect(service.update(undefined, formatoDto)).rejects.toThrow(
        new BadRequestException(),
      );

      expect(repository.findOne).toHaveBeenCalledTimes(0);
      expect(repository.find).toHaveBeenCalledTimes(0);
      expect(repository.update).toHaveBeenCalledTimes(0);
    });

    it('should return an error when trying to update to an invalid formato', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);
      repository.find = jest.fn().mockImplementation(findExistingByOperators);
      repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);

      const formatoDto =
        AssemblerFormato.disassemblyToUpdateFormatoDto(formatoFakePDF);

      formatoDto.formato = undefined;
      await expect(
        service.update(formatoFakePDF.id, formatoDto),
      ).rejects.toThrow(new BadRequestException('Format is invalid'));

      formatoDto.formato = null;
      await expect(
        service.update(formatoFakePDF.id, formatoDto),
      ).rejects.toThrow(new BadRequestException('Format is invalid'));

      formatoDto.formato = '';
      await expect(
        service.update(formatoFakePDF.id, formatoDto),
      ).rejects.toThrow(new BadRequestException('Format is invalid'));

      expect(repository.findOne).toHaveBeenCalledTimes(0);
      expect(repository.find).toHaveBeenCalledTimes(0);
      expect(repository.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('findAll', () => {
    it('should return an array of formatos', async () => {
      repository.find = jest.fn().mockImplementation(findAll);

      const formatos = await service.findAll();

      expect(formatosFake).toEqual(formatos);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a formato', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);

      const formato = await service.findOne(formatoFakePDF.id);

      expect(formatoFakePDF).toEqual(formato);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an error when id is not provided', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);

      await expect(service.findOne('')).rejects.toThrow(
        new BadRequestException(),
      );

      expect(repository.findOne).toHaveBeenCalledTimes(0);
    });

    it('should return an error when not finding a formato', async () => {
      repository.findOne = jest.fn().mockImplementation(findOneById);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        new NotFoundException(),
      );

      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
