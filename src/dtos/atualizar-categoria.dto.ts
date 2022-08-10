import { IsArray, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class AtualizarCategoriaDto {
  @IsString()
  @IsOptional()
  descricao: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[];
}

export interface Evento {
  nome: string;
  operacao: string;
  valor: string;
}
