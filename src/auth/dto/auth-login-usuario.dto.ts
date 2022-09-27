import { IsEmail, IsMobilePhone, IsString, Matches } from 'class-validator';

export class AuthLoginUsuarioDto {
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
}
