import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UsersService } from "./users.service";

/**
 * Módulo responsável pela funcionalidade de usuários.
 *
 * No NestJS, módulos são a unidade fundamental de organização
 * da aplicação. Cada módulo encapsula:
 *
 * - entidades
 * - serviços
 * - controllers
 * - providers
 *
 * Isso mantém as responsabilidades bem separadas e facilita
 * a evolução da arquitetura conforme o sistema cresce.
 */
@Module({
  /**
   * Registra o repositório do TypeORM para a entidade UserEntity
   * dentro do contexto deste módulo.
   *
   * O método `forFeature` permite que serviços do módulo
   * injetem o Repository<UserEntity> via `@InjectRepository`.
   */
  imports: [TypeOrmModule.forFeature([UserEntity])],

  /**
   * Providers são os serviços que pertencem a este módulo.
   *
   * O Nest gerencia o ciclo de vida dessas classes e
   * permite que elas sejam injetadas em outros lugares.
   */
  providers: [UsersService],

  /**
   * Exporta elementos que poderão ser utilizados
   * por outros módulos da aplicação.
   *
   * Aqui exportamos:
   *
   * UsersService → para que outros módulos (ex: AuthModule)
   * possam consultar ou criar usuários.
   *
   * TypeOrmModule → permite que outros módulos também
   * utilizem o repositório da entidade UserEntity se necessário.
   */
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
