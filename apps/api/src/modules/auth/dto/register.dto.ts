import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * DTO (Data Transfer Object) usado no endpoint de registro de usuário.
 *
 * DTOs definem o formato esperado dos dados que chegam na API.
 * No NestJS, eles funcionam em conjunto com o ValidationPipe para:
 *
 * - validar dados automaticamente
 * - rejeitar entradas inválidas
 * - documentar o contrato da API
 *
 * Isso ajuda a proteger a aplicação contra dados malformados
 * ou tentativas básicas de abuso da API.
 */
export class RegisterDto {
  /**
   * Email do usuário que deseja se registrar.
   *
   * O decorator @IsEmail garante que o valor recebido
   * tenha formato válido de email.
   *
   * Exemplos válidos:
   * user@email.com
   * user.name@domain.org
   */
  @IsEmail()
  email!: string;

  /**
   * Senha em texto puro enviada pelo cliente.
   *
   * Importante:
   * - esta senha NÃO deve ser armazenada diretamente
   * - ela será transformada em hash (bcrypt/argon2)
   *   dentro do AuthService antes de salvar no banco
   *
   * @MinLength(8) define um requisito mínimo de segurança
   * para evitar senhas muito fracas.
   */
  @IsString()
  @MinLength(8)
  password!: string;
}
