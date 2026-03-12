import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * DTO (Data Transfer Object) utilizado no endpoint de login.
 *
 * Define o formato esperado do payload enviado pelo cliente
 * quando um usuário tenta se autenticar.
 *
 * Em conjunto com o ValidationPipe do NestJS, esse DTO garante:
 * - validação automática dos dados recebidos
 * - retorno de erro 400 caso o payload seja inválido
 * - contrato claro da API.
 */
export class LoginDto {
  /**
   * Email do usuário que está tentando autenticar.
   *
   * @IsEmail garante que o valor tenha formato válido.
   * A normalização (trim/lowercase) geralmente é aplicada
   * no service ou na entidade antes da consulta no banco.
   */
  @IsEmail()
  email!: string;

  /**
   * Senha em texto puro enviada pelo cliente.
   *
   * Importante:
   * - nunca é armazenada diretamente
   * - será comparada com o hash salvo no banco
   *   usando bcrypt ou argon2 dentro do AuthService.
   *
   * @MinLength(8) impede tentativas triviais
   * com senhas muito curtas.
   */
  @IsString()
  @MinLength(8)
  password!: string;
}
