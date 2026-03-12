import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

/**
 * Classe responsável por validar variáveis de ambiente
 * no momento de inicialização da aplicação.
 *
 * Em NestJS é comum usar `class-validator` junto com
 * `class-transformer` e `ConfigModule` para garantir que
 * todas as variáveis necessárias estejam corretamente
 * definidas antes da API iniciar.
 *
 * Isso evita erros silenciosos em produção causados por:
 * - variáveis ausentes
 * - tipos incorretos
 * - configuração incompleta
 */
export class EnvValidation {
  /**
   * Porta onde a API será executada.
   *
   * É opcional porque o sistema possui fallback
   * no `main.ts` (porta 3001).
   *
   * Usamos string porque variáveis de ambiente
   * sempre chegam como texto.
   */
  @IsNumberString()
  @IsOptional()
  API_PORT?: string;

  /**
   * URL de conexão com o banco de dados.
   *
   * Exemplo:
   * postgres://user:password@localhost:5432/memoryos
   *
   * É obrigatória porque a aplicação depende do banco
   * para praticamente todas as operações.
   */
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  /**
   * Chave secreta usada para assinar tokens JWT.
   *
   * Essa chave deve ser:
   * - longa
   * - aleatória
   * - mantida apenas no ambiente do servidor
   *
   * Nunca deve ser exposta ao frontend.
   */
  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  /**
   * Tempo de expiração dos tokens JWT.
   *
   * Exemplos válidos:
   * - "1h"
   * - "15m"
   * - "7d"
   *
   * O formato geralmente é interpretado pela lib
   * `jsonwebtoken`.
   */
  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  /**
   * URL pública do frontend.
   *
   * Usada principalmente para:
   * - configuração de CORS
   * - comunicação entre frontend e API
   *
   * Opcional porque em desenvolvimento
   * podemos permitir qualquer origem.
   */
  @IsString()
  @IsOptional()
  NEXT_PUBLIC_API_URL?: string;
}
