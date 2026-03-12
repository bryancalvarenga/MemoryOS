import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getTypeOrmConfig } from "./database/typeorm.config";
import { validateEnv } from "./config/validate-env";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthController } from "./modules/health/health.controller";
import { UsersModule } from "./modules/users/users.module";

/**
 * Módulo raiz da aplicação.
 *
 * O AppModule funciona como o ponto de entrada da arquitetura
 * do NestJS. Ele registra os módulos principais da aplicação
 * e configura serviços globais como:
 *
 * - configuração de ambiente
 * - conexão com banco de dados
 * - módulos de domínio
 */
@Module({
  imports: [
    /**
     * ConfigModule carrega variáveis de ambiente (.env)
     * e as disponibiliza via ConfigService.
     *
     * isGlobal: true
     * → torna o ConfigService acessível em qualquer módulo
     * sem precisar importar ConfigModule novamente.
     *
     * validate: validateEnv
     * → executa validação das variáveis de ambiente
     * antes da aplicação iniciar (fail-fast).
     */
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    /**
     * Configuração da conexão com banco usando TypeORM.
     *
     * forRootAsync permite que a configuração dependa
     * de serviços injetados (como ConfigService).
     */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      /**
       * Factory que gera a configuração do banco dinamicamente.
       */
      useFactory: (configService: ConfigService) => {
        /**
         * Obtém a URL de conexão com o banco a partir
         * das variáveis de ambiente.
         */
        const databaseUrl = configService.get<string>("DATABASE_URL");

        /**
         * Falha rápida se o banco não estiver configurado.
         * Isso evita que a aplicação suba sem persistência.
         */
        if (!databaseUrl) {
          throw new Error("DATABASE_URL is not configured.");
        }

        /**
         * Retorna a configuração centralizada do TypeORM.
         */
        return getTypeOrmConfig(databaseUrl);
      },
    }),

    /**
     * Módulo responsável pelo domínio de usuários.
     *
     * Contém:
     * - UserEntity
     * - UsersService
     */
    UsersModule,

    /**
     * Módulo responsável por autenticação.
     *
     * Contém:
     * - AuthController
     * - AuthService
     * - JwtStrategy
     * - JWT configuration
     */
    AuthModule,
  ],

  /**
   * Controllers registrados diretamente no módulo raiz.
   *
   * Neste caso temos apenas o HealthController,
   * usado para monitoramento da aplicação.
   */
  controllers: [HealthController],
})
export class AppModule {}
