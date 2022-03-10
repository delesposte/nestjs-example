import { Formato } from '../entities/formato.entity';
import { CreateFormatoDto } from './create-formato.dto';
import { UpdateFormatoDto } from './update-formato.dto';

export class AssemblerFormato {
  public static assembly(dto: CreateFormatoDto): Formato {
    const entity = new Formato();
    entity.formato = dto.formato;
    entity.ativo = dto.ativo;
    return entity;
  }

  public static disassemblyToCreateFormatoDto(
    entity: Formato,
  ): CreateFormatoDto {
    const dto = new CreateFormatoDto();
    dto.formato = entity.formato;
    dto.ativo = entity.ativo;
    return dto;
  }

  public static disassemblyToUpdateFormatoDto(
    entity: Formato,
  ): UpdateFormatoDto {
    const dto = new UpdateFormatoDto();
    dto.formato = entity.formato;
    dto.ativo = entity.ativo;
    return dto;
  }
}
