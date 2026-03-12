import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserEntity } from "../modules/users/user.entity";

/**
 * Função responsável por gerar a configuração do TypeORM.
 *
 * Separar essa lógica em uma função ajuda a:
 * - manter o AppModule mais limpo
 * - centralizar a configuração do banco
 * - facilitar testes e futura expansão da infra
 */
export function getTypeOrmConfig(databaseUrl: string): TypeOrmModuleOptions {
  return {
    /**
     * Define o tipo de banco utilizado.
     * O MemoryOS usa PostgreSQL como banco principal.
     *
     * Postgres é uma escolha comum para sistemas complexos
     * por oferecer:
     * - consistência forte
     * - bom suporte a JSON
     * - extensões poderosas
     */
    type: "postgres",

    /**
     * URL completa de conexão com o banco.
     *
     * Exemplo:
     * postgres://user:password@localhost:5432/memoryos
     *
     * Normalmente vem da variável de ambiente DATABASE_URL.
     */
    url: databaseUrl,

    /**
     * Lista explícita de entidades usadas pelo TypeORM.
     *
     * Cada entidade representa uma tabela no banco.
     *
     * Aqui começamos apenas com UserEntity,
     * mas o sistema deve crescer para incluir entidades como:
     *
     * - MemoryEntity
     * - AgentEntity
     * - DocumentEntity
     * - SessionEntity
     */
    entities: [UserEntity],

    /**
     * synchronize: false é extremamente importante em produção.
     *
     * Quando true, o TypeORM altera automaticamente o schema
     * do banco com base nas entidades.
     *
     * Isso é perigoso em ambientes reais porque pode:
     * - apagar dados
     * - modificar colunas inesperadamente
     *
     * Em produção devemos usar MIGRATIONS.
     */
    synchronize: false,

    /**
     * autoLoadEntities desativado significa que
     * apenas entidades explicitamente registradas
     * serão carregadas.
     *
     * Isso torna o comportamento mais previsível
     * e evita carregar entidades indesejadas.
     */
    autoLoadEntities: false,
  };
}
