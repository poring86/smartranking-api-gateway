import { IsEmail, IsMobilePhone, IsString, Matches } from 'class-validator';

export class AuthRegistroUsuarioDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  //   - Mínimo 8 caracteres
  //   - uma letra maiúscula
  //   - uma letra minúscula
  //   - um numero

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'senha inválida',
  })
  senha: string;

  @IsMobilePhone('pt-BR')
  telefoneCelular: string;
}
