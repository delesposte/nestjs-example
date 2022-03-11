import { CreateFormatoDto } from './dto/createFormato.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equal, Not, Repository, UpdateResult } from 'typeorm';
import { Formato } from './entities/formato.entity';
import { FormatoService } from './formato.service';
import { plainToClass } from 'class-transformer';
import { UpdateFormatoDto } from './dto/updateFormato.dto';

export class EntityFakeFactory {
  public static create(): Formato {
    const entity = new Formato();
    entity.id = '11ec0719-459e-460e-b7d9-73a4012e5b11';
    entity.formato = 'png';
    entity.ativo = true;
    return entity;
  }
}

describe('FormatoService', () => {
  let service: FormatoService;
  let repository: Repository<Formato>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormatoService,
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
    describe('given a DTO Formato', () => {
      const entity = EntityFakeFactory.create();
      const dto = plainToClass(CreateFormatoDto, entity);

      describe('when DTO Formato is valid', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue(undefined);
          repository.save = jest.fn().mockResolvedValue(entity);
        })

        it('should create a Formato', async () => {
          const Formato = await service.create(dto);
          expect(repository.save).toHaveBeenCalledTimes(1);
          expect(repository.save).toHaveBeenCalledWith(entity);
          expect(Formato).toEqual(entity);
        })
      })

      describe('when Formato already exists', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue([entity]);
          repository.save = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Formato already exists'));
          expect(repository.find).toHaveBeenCalledWith({
            formato: Equal(dto.formato)
          })
          expect(repository.save).toHaveBeenCalledTimes(0);
        })
      })

      describe('when formato is undefined', () => {
        beforeEach(() => {
          repository.save = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { formato: undefined });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Formato is invalid'));
          expect(repository.save).toHaveBeenCalledTimes(0);
        })
      })

      describe('when formato is empty', () => {
        beforeEach(() => {
          repository.save = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { formato: '' });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Formato is invalid'));
          expect(repository.save).toHaveBeenCalledTimes(0);
        })
      })

      describe('when ativo is undefined', () => {
        beforeEach(() => {
          repository.save = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          const dto = plainToClass(CreateFormatoDto, { ativo: undefined });
          await expect(service.create(dto)).rejects.toThrow(
            new BadRequestException('Formato is invalid'));
          expect(repository.save).toHaveBeenCalledTimes(0);
        })
      })
    })
  });

  describe('update', () => {
    describe('given a Formato id and a DTO Formato', () => {
      const entity = EntityFakeFactory.create();
      entity.ativo = false;
      entity.formato = 'png';

      const dto = plainToClass(UpdateFormatoDto, entity);

      const updateResultAffectedOne = new UpdateResult();
      updateResultAffectedOne.affected = 1;

      const updateResultAffectedNone = new UpdateResult();
      updateResultAffectedNone.affected = 0;

      describe('when id exists and DTO Formato is valid', () => {
        beforeEach(() => {
          repository.findOne = jest.fn().mockResolvedValue(entity);
          repository.find = jest.fn().mockResolvedValue(undefined);
          repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);
        })

        it('should update a Formato', async () => {
          const Formato = await service.update(entity.id, dto);
          expect(repository.update).toHaveBeenCalledTimes(1);
          expect(repository.update).toHaveBeenCalledWith(entity.id, entity);
          expect(Formato).toEqual(entity);
        })
      })

      describe('when Formato does not exists', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue(undefined);
          repository.update = jest.fn().mockResolvedValue(updateResultAffectedNone);
        })

        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new NotFoundException());
          expect(repository.update).toHaveBeenCalledTimes(1);
        })
      })

      describe('when updating to a Formato that already exists', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue([entity]);
          repository.update = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new BadRequestException('Formato already exists'));
          expect(repository.find).toHaveBeenCalledWith({
            formato: Equal(dto.formato),
            id: Not(entity.id)
          })
          expect(repository.update).toHaveBeenCalledTimes(0);
        })
      })

      describe('when the update does not affect anything', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue(undefined);
          repository.update = jest.fn().mockResolvedValue(updateResultAffectedNone);
        })

        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new NotFoundException());
          expect(repository.update).toHaveBeenCalledTimes(1);
        })
      })

      describe('when not finding a Formato to return after update', () => {
        beforeEach(() => {
          repository.find = jest.fn().mockResolvedValue(undefined);
          repository.findOne = jest.fn().mockResolvedValue(undefined);
          repository.update = jest.fn().mockResolvedValue(updateResultAffectedOne);
        })

        it('should return an error', async () => {
          await expect(service.update(entity.id, dto)).rejects.toThrow(
            new NotFoundException());
          expect(repository.update).toHaveBeenCalledTimes(1);
        })
      })

      describe('when DTO Formato is undefined', () => {
        beforeEach(() => {
          repository.update = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.update(entity.id, undefined)).rejects.toThrow(
            new BadRequestException());
          expect(repository.update).toHaveBeenCalledTimes(0);
        })
      })

      describe('when id is empty', () => {
        beforeEach(() => {
          repository.update = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.update('', dto)).rejects.toThrow(
            new BadRequestException());
          expect(repository.update).toHaveBeenCalledTimes(0);
        })
      })

      describe('when id is undefined', () => {
        beforeEach(() => {
          repository.update = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.update(undefined, dto)).rejects.toThrow(
            new BadRequestException());
          expect(repository.update).toHaveBeenCalledTimes(0);
        })
      })
    })
  })

  describe('findAll', () => {
    describe('given an array of Formatos', () => {
      const FormatosFake = [EntityFakeFactory.create()];

      beforeEach(() => {
        repository.find = jest.fn().mockResolvedValue(FormatosFake);
      })

      describe('when no params', () => {
        it('should return all Formatos', async () => {
          const Formatos = await service.findAll();
          expect(FormatosFake).toEqual(Formatos);
          expect(repository.find).toHaveBeenCalledTimes(1);
        })
      })
    })
  })

  describe('findOne', () => {
    describe('given a Formato id', () => {
      const entity = EntityFakeFactory.create();

      describe('when id exists', () => {
        beforeEach(() => {
          repository.findOne = jest.fn().mockResolvedValue(entity);
        })

        it('should return a Formato', async () => {
          const Formato = await service.findOne(entity.id);
          expect(entity).toEqual(Formato);
          expect(repository.findOne).toHaveBeenCalledTimes(1);
        })
      })

      describe('when id is empty', () => {
        beforeEach(() => {
          repository.findOne = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.findOne('')).rejects.toThrow(
            new BadRequestException());
          expect(repository.findOne).toHaveBeenCalledTimes(0);
        })
      })

      describe('when not finding a Formato', () => {
        const id = '99ec0719-459e-460e-b7d9-73a4012e5b99';

        beforeEach(() => {
          repository.findOne = jest.fn().mockResolvedValue(undefined);
        })

        it('should return an error', async () => {
          await expect(service.findOne(id)).rejects.toThrow(
            new NotFoundException());
          expect(repository.findOne).toHaveBeenCalledTimes(1);
        })
      })
    })
  })
});