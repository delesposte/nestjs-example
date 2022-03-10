import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@Expose()
export class CreateFormatoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  formato: string;

  @IsNotEmpty()
  @IsBoolean()
  ativo: boolean;
}
