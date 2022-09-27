import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUsuarioDto } from './dto/auth-login-usuario.dto';
import { AuthRegistroUsuarioDto } from './dto/auth-registro-usuario.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/registro')
  @UsePipes(ValidationPipe)
  async registro(@Body() authRegistroUsuarioDto: AuthRegistroUsuarioDto) {
    return await this.awsCognitoService.registrarUsuario(
      authRegistroUsuarioDto,
    );
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUsuarioDto: AuthLoginUsuarioDto) {
    return await this.awsCognitoService.autenticarUsuario(authLoginUsuarioDto);
  }
}
