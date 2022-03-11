import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

@Exclude()
export class OutputFormatoDto {

    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly id: string;    

    @Expose()
    @IsString()
    @IsNotEmpty()
    readonly formato: string;

    @Expose()    
    @IsNotEmpty()
    @IsBoolean()
    readonly ativo: boolean;

}
