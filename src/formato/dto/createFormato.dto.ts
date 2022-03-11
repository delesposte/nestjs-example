import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@Expose()
export class CreateFormatoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  readonly formato: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly ativo: boolean;
}
