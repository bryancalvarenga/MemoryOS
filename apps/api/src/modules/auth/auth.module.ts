import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

/**
 * Módulo responsável por toda a funcionalidade de autenticação.
 *
 * Este módulo centraliza:
 * - registro de usuário
 * - login
 * - geração de JWT
 * - validação de tokens
 * - rotas protegidas
 *
 * Ele depende do UsersModule para acessar e criar usuários.
 */
@Module({
  imports: [
    /**
     * Importa o módulo de usuários para que o AuthService
     * possa consultar e criar registros de usuário.
     */
    UsersModule,

    /**
     * Configuração do módulo JWT do NestJS.
     *
     * registerAsync permite que a configuração dependa
     * de serviços injetados (como o ConfigService).
     *
     * Isso é útil porque as variáveis vêm do ambiente
     * (.env / secrets da infraestrutura).
     */
    JwtModule.registerAsync({
      /**
       * Especifica quais dependências devem ser injetadas
       * na factory de configuração.
       */
      inject: [ConfigService],

      /**
       * Factory responsável por gerar a configuração
       * do JWT dinamicamente.
       */
      useFactory: (configService: ConfigService) => {
        /**
         * Obtém o segredo usado para assinar os tokens.
         */
        const secret = configService.get<string>("JWT_SECRET");

        /**
         * Obtém o tempo de expiração do token.
         * Exemplos comuns:
         * 1h
         * 15m
         * 7d
         */
        const expiresIn = configService.get<string>("JWT_EXPIRES_IN");

        /**
         * Fail-fast: se a configuração estiver ausente,
         * a aplicação não inicia.
         */
        if (!secret || !expiresIn) {
          throw new Error("JWT configuration is missing.");
        }

        /**
         * Retorna a configuração usada internamente
         * pelo JwtService para assinar tokens.
         */
        return {
          secret,

          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],

  /**
   * Controllers responsáveis por expor
   * os endpoints HTTP deste módulo.
   */
  controllers: [AuthController],

  /**
   * Providers que pertencem ao módulo.
   *
   * AuthService → lógica de autenticação
   * JwtStrategy → validação de tokens nas requisições
   */
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
