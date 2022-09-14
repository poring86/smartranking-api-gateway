import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from '../desafio-status.enum';

export interface Desafio {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  categoria: string;
  jogadores: Jogador[];
}
