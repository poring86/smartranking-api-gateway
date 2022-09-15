import { PipeTransform, BadRequestException } from '@nestjs/common';
import { DesafioStatus } from '../desafio-status.enum';

export class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    if (typeof value.status === 'string') {
      const status = value.status.toUpperCase();

      if (!this.ehStatusValido(status)) {
        throw new BadRequestException(`${status} é um status inválido`);
      }
      return value;
    } else {
      throw new BadRequestException(`Parametros inválidos!`);
    }
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
