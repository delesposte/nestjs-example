import { PartialType } from "@nestjs/mapped-types";
import { CreateFormatoDto } from "./createFormato.dto";

export class UpdateFormatoDto extends PartialType(CreateFormatoDto) { }
