import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthLoginUsuarioDto } from 'src/auth/dto/auth-login-usuario.dto';
import { AuthRegistroUsuarioDto } from 'src/auth/dto/auth-registro-usuario.dto';
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  constructor(private authConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }
  async registrarUsuario(authRegistroUsuarioDto: AuthRegistroUsuarioDto) {
    const { nome, email, senha, telefoneCelular } = authRegistroUsuarioDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        senha,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: telefoneCelular,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: nome,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async autenticarUsuario(authLoginUsuarioDto: AuthLoginUsuarioDto) {
    const { email, senha } = authLoginUsuarioDto;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: senha,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
