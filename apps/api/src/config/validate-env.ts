import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvValidation } from "./env.validation";

/**
 * Função responsável por validar todas as variáveis de ambiente
 * utilizadas pela aplicação.
 *
 * Esse processo normalmente é executado durante a inicialização
 * do NestJS através do ConfigModule.
 *
 * Se qualquer variável obrigatória estiver ausente ou inválida,
 * a aplicação falha imediatamente (fail fast).
 *
 * Isso evita que o sistema suba com configuração quebrada e
 * cause erros difíceis de diagnosticar em produção.
 */
export function validateEnv(config: Record<string, unknown>) {
  /**
   * Converte o objeto simples de variáveis de ambiente
   * (process.env) em uma instância da classe EnvValidation.
   *
   * Isso permite que os decorators do class-validator
   * sejam aplicados corretamente.
   *
   * enableImplicitConversion: false significa que o sistema
   * não tentará converter tipos automaticamente.
   *
   * Exemplo:
   * "3001" NÃO vira número automaticamente.
   *
   * Isso evita conversões silenciosas inesperadas.
   */
  const validatedConfig = plainToInstance(EnvValidation, config, {
    enableImplicitConversion: false,
  });

  /**
   * Executa a validação baseada nos decorators definidos
   * em EnvValidation.
   *
   * skipMissingProperties: false garante que propriedades
   * obrigatórias realmente sejam verificadas.
   */
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  /**
   * Se qualquer erro de validação for encontrado,
   * a aplicação é interrompida imediatamente.
   *
   * Isso impede que o servidor inicie com:
   * - DATABASE_URL ausente
   * - JWT_SECRET inválido
   * - configurações incompletas
   */
  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  /**
   * Retorna o objeto já validado.
   *
   * A partir daqui o restante da aplicação pode confiar
   * que todas as variáveis obrigatórias existem e possuem
   * o formato correto.
   */
  return validatedConfig;
}
