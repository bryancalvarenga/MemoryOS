import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./types/jwt-payload.type";

/**
 * Estratégia de autenticação baseada em JWT.
 *
 * O NestJS utiliza o Passport por baixo dos panos para lidar
 * com estratégias de autenticação. Aqui registramos uma estratégia
 * que valida tokens JWT enviados nas requisições.
 *
 * Essa estratégia será usada automaticamente por guards como:
 *
 * @UseGuards(AuthGuard('jwt'))
 *
 * permitindo proteger endpoints da API.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    /**
     * Obtém o segredo usado para assinar e validar tokens JWT.
     *
     * Esse valor deve ser o mesmo configurado no JwtModule
     * quando os tokens são gerados.
     */
    const secret = configService.get<string>("JWT_SECRET");

    /**
     * Falha rápida caso o segredo não esteja configurado.
     *
     * Isso evita que a aplicação suba sem a chave necessária
     * para validar tokens — algo que comprometeria a segurança.
     */
    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    /**
     * Configuração da estratégia JWT.
     */
    super({
      /**
       * Define de onde o token será extraído na requisição.
       *
       * Neste caso esperamos o padrão HTTP:
       *
       * Authorization: Bearer <token>
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * Quando false, o Passport automaticamente rejeita
       * tokens expirados.
       */
      ignoreExpiration: false,

      /**
       * Segredo usado para verificar a assinatura do token.
       */
      secretOrKey: secret,
    });
  }

  /**
   * Método executado automaticamente após o token
   * ser validado com sucesso.
   *
   * O payload decodificado do JWT é recebido aqui.
   *
   * O objeto retornado será anexado ao objeto `request`
   * como `request.user`.
   */
  validate(payload: JwtPayload) {
    return {
      /**
       * Identificador do usuário autenticado.
       */
      userId: payload.sub,

      /**
       * Email incluído no token para facilitar
       * acesso rápido a informações básicas da sessão.
       */
      email: payload.email,
    };
  }
}
