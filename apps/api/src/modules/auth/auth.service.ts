import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./types/jwt-payload.type";

/**
 * Service responsável pelos fluxos de autenticação da aplicação.
 *
 * Aqui ficam as regras relacionadas a:
 * - registro de usuário
 * - validação de credenciais
 * - geração de JWT
 * - retorno de dados do usuário autenticado
 *
 * Importante:
 * Este service cuida da autenticação.
 * O acesso direto a dados de usuário continua delegado ao UsersService.
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * Service de usuários usado para consultar e criar registros.
     *
     * Mantemos a lógica de persistência separada da lógica de autenticação.
     */
    private readonly usersService: UsersService,

    /**
     * Serviço do Nest responsável por assinar e validar tokens JWT.
     */
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário.
   *
   * Fluxo:
   * 1. verifica se já existe usuário com o email informado
   * 2. gera o hash seguro da senha
   * 3. cria o usuário no banco
   * 4. retorna apenas dados públicos/minimamente necessários
   */
  async register(input: RegisterDto) {
    /**
     * Verifica se já existe conta com o mesmo email.
     *
     * Isso evita duplicidade lógica antes mesmo de o banco
     * barrar pela constraint unique.
     */
    const existingUser = await this.usersService.findByEmail(input.email);

    if (existingUser) {
      /**
       * ConflictException → HTTP 409
       *
       * Indica que o recurso não pode ser criado porque
       * já existe um usuário com esse email.
       */
      throw new ConflictException("Email already in use.");
    }

    /**
     * Gera o hash da senha usando bcrypt.
     *
     * O valor 12 representa o custo computacional (salt rounds).
     * É um equilíbrio comum entre segurança e performance.
     *
     * Nunca armazenamos a senha original no banco.
     */
    const passwordHash = await bcrypt.hash(input.password, 12);

    /**
     * Cria o usuário persistindo email + hash da senha.
     *
     * A normalização do email continua sendo garantida pela entidade/service.
     */
    const user = await this.usersService.create({
      email: input.email,
      passwordHash,
    });

    /**
     * Retornamos apenas dados essenciais.
     *
     * Não retornamos:
     * - passwordHash
     * - informações sensíveis
     * - token automático (neste fluxo inicial)
     */
    return {
      user_id: user.id,
      email: user.email,
    };
  }

  /**
   * Realiza login do usuário.
   *
   * Fluxo:
   * 1. busca usuário pelo email
   * 2. compara senha enviada com o hash salvo
   * 3. gera token JWT se as credenciais forem válidas
   */
  async login(input: LoginDto) {
    /**
     * Busca o usuário pelo email informado.
     */
    const user = await this.usersService.findByEmail(input.email);

    /**
     * Não revelamos se o problema foi "email inexistente"
     * ou "senha incorreta".
     *
     * Isso evita enumeração de usuários e é uma prática
     * importante de segurança.
     */
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    /**
     * Compara a senha em texto puro enviada pelo cliente
     * com o hash armazenado no banco.
     */
    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      /**
       * Mesma mensagem genérica por segurança.
       */
      throw new UnauthorizedException("Invalid credentials.");
    }

    /**
     * Payload padrão do JWT.
     *
     * sub → identificador principal do usuário
     * email → dado básico útil para contexto autenticado
     */
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    /**
     * Gera o token de acesso assinado.
     *
     * A expiração real depende da configuração do JwtModule.
     */
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,

      /**
       * Tempo de vida do token em segundos.
       *
       * Importante:
       * esse valor precisa permanecer alinhado com a configuração
       * real do JWT_EXPIRES_IN para não gerar inconsistência.
       */
      expires_in: 3600,
    };
  }

  /**
   * Retorna informações básicas do usuário autenticado.
   *
   * Normalmente este método é usado por uma rota protegida
   * como GET /auth/me, onde o userId vem do token JWT validado.
   */
  async me(userId: string) {
    /**
     * Busca o usuário autenticado pelo ID extraído do token.
     */
    const user = await this.usersService.findById(userId);

    if (!user) {
      /**
       * Se o token for válido mas o usuário não existir mais,
       * tratamos como não autorizado.
       */
      throw new UnauthorizedException("User not found.");
    }

    /**
     * Retornamos somente dados públicos/relevantes para a sessão.
     */
    return {
      user_id: user.id,
      email: user.email,
      created_at: user.createdAt,
    };
  }
}
