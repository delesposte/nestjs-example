import { CreateFormatoDto } from './dto/createFormato.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Formato } from './entities/formato.entity';
import { FormatoService } from './formato.service';
import { plainToClass } from 'class-transformer';
import { UpdateFormatoDto } from './dto/updateFormato.dto';

export class EntityFakeFactory {
  public static create(): Formato {
    const entity = new Formato();
    entity.id = '11ec0719-459e-460e-b7d9-73a4012e5b11';
    entity.formato = 'pdf';
    entity.ativo = true;
    return entity;
  }
}

describe('FormatoService', () => {
  let service: FormatoService;
  let repository: Repository<Formato>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormatoService,
        {
          provide: getRepositoryToken(Formato),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FormatoService>(FormatoService);
    repository = module.get<Repository<Formato>>(getRepositoryToken(Formato));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    describe('given a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(CreateFormatoDto, entity);

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue(undefined);
        repository.save = jest.fn().mockResolvedValue(entity);
      });

      describe('when DTO formato is valid', () => {
        it('should create a formato', async () => {
          const formato = await service.create(dto);
          expect(repository.save).toHaveBeenCalledTimes(1);
          expect(repository.save).toHaveBeenCalledWith(entity);
          expect(formato).toEqual(entity);
        });
      });
    });

    describe('given a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(CreateFormatoDto, entity);

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue([entity]);
        repository.save = jest.fn().mockResolvedValue(undefined);
      });

      describe('when formato already exists', () => {
        it('should return an error', async () => {
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Format already exists'),
          );
          expect(repository.save).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('given a DTO formato', () => {
      beforeEach(() => {
        repository.save = jest.fn().mockResolvedValue(undefined);
      });

      describe('when formato is undefined', () => {
        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { formato: undefined });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Format is invalid'),
          );
          expect(repository.save).toHaveBeenCalledTimes(0);
        });
      });

      describe('when formato is empty', () => {
        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { formato: '' });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Format is invalid'),
          );
          expect(repository.save).toHaveBeenCalledTimes(0);
        });
      });

      describe('when ativo is undefined', () => {
        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { ativo: undefined });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Format is invalid'),
          );
          expect(repository.save).toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  describe('update', () => {
    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      entity.ativo = false;
      entity.formato = 'txt';

      const dto = plainToClass(UpdateFormatoDto, entity);
      const updateResultAffectedOne = new UpdateResult();
      updateResultAffectedOne.affected = 1;

      beforeEach(() => {
        repository.findOne = jest.fn().mockResolvedValue(entity);
        repository.find = jest.fn().mockResolvedValue(undefined);
        repository.update = jest
          .fn()
          .mockResolvedValue(updateResultAffectedOne);
      });

      describe('when id exists and DTO formato is valid', () => {
        it('should update a formato', async () => {
          const formato = await service.update(entity.id, dto);
          expect(repository.update).toHaveBeenCalledTimes(1);
          expect(repository.update).toHaveBeenCalledWith(entity.id, entity);
          expect(formato).toEqual(entity);
        });
      });
    });

    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(UpdateFormatoDto, entity);
      const updateResultAffectedNone = new UpdateResult();
      updateResultAffectedNone.affected = 0;

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue(undefined);
        repository.update = jest
          .fn()
          .mockResolvedValue(updateResultAffectedNone);
      });

      describe('when formato does not exists', () => {
        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new NotFoundException(),
          );
          expect(repository.update).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(UpdateFormatoDto, entity);

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue([entity]);
        repository.update = jest.fn().mockResolvedValue(undefined);
      });

      describe('when updating to a formato that already exists', () => {
        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new BadRequestException('Format already exists'),
          );
          expect(repository.update).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(UpdateFormatoDto, entity);
      const updateResultAffectedNone = new UpdateResult();
      updateResultAffectedNone.affected = 0;

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue(undefined);
        repository.update = jest
          .fn()
          .mockResolvedValue(updateResultAffectedNone);
      });

      describe('when the update does not affect anything', () => {
        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new NotFoundException(),
          );
          expect(repository.update).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();

      beforeEach(() => {
        repository.update = jest.fn().mockResolvedValue(undefined);
      });

      describe('when DTO formato is undefined', () => {
        it('should return an error', async () => {
          await expect(service.update(entity.id, undefined)).rejects.toThrow(
            new BadRequestException(),
          );
          expect(repository.update).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('given a formato id and a DTO formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(UpdateFormatoDto, entity);

      beforeEach(() => {
        repository.update = jest.fn().mockResolvedValue(undefined);
      });

      describe('when id is empty', () => {
        it('should return an error', async () => {
          await expect(service.update('', dto)).rejects.toThrow(
            new BadRequestException(),
          );
          expect(repository.update).toHaveBeenCalledTimes(0);
        });
      });

      describe('when id is undefined', () => {
        it('should return an error', async () => {
          await expect(service.update(undefined, dto)).rejects.toThrow(
            new BadRequestException(),
          );
          expect(repository.update).toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  describe('findAll', () => {
    describe('given an array of formatos', () => {
      const formatosFake = [EntityFakeFactory.create()];

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue(formatosFake);
      });

      describe('when no params', () => {
        it('should return all formatos', async () => {
          const formatos = await service.findAll();
          expect(formatosFake).toEqual(formatos);
          expect(repository.find).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('findOne', () => {
    describe('given a formato id', () => {
      const entity = EntityFakeFactory.create();

      beforeEach(() => {
        repository.findOne = jest.fn().mockResolvedValue(entity);
      });

      describe('when formato id exists', () => {
        it('should return a formato', async () => {
          const formato = await service.findOne(entity.id);
          expect(entity).toEqual(formato);
          expect(repository.findOne).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('given a formato id', () => {
      beforeEach(() => {
        repository.findOne = jest.fn().mockResolvedValue(undefined);
      });

      describe('when id is empty', () => {
        it('should return an error', async () => {
          await expect(service.findOne('')).rejects.toThrow(
            new BadRequestException(),
          );
          expect(repository.findOne).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('given a formato id', () => {
      const id = '99ec0719-459e-460e-b7d9-73a4012e5b99';

      beforeEach(() => {
        repository.findOne = jest.fn().mockResolvedValue(undefined);
      });

      describe('when not finding a formato', () => {
        it('should return an error', async () => {
          await expect(service.findOne(id)).rejects.toThrow(
            new NotFoundException(),
          );
          expect(repository.findOne).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
