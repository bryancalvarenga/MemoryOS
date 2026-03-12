import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Função principal que inicializa a aplicação NestJS.
 *
 * Todo o ciclo de vida da API começa aqui.
 * Este arquivo é responsável por configurar:
 *
 * - CORS
 * - pipes globais
 * - prefixo de rotas
 * - inicialização do servidor HTTP
 */
async function bootstrap() {
  /**
   * Cria a aplicação Nest baseada no AppModule,
   * que contém toda a estrutura da API.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Habilita CORS (Cross-Origin Resource Sharing).
   *
   * Necessário para permitir que o frontend
   * (ex: Next.js) faça requisições para a API.
   *
   * origin: true
   * → permite qualquer origem (útil em desenvolvimento).
   *
   * credentials: true
   * → permite envio de cookies/headers de autenticação.
   */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  /**
   * Prefixo global das rotas da API.
   *
   * Neste caso está vazio porque os controllers
   * já definem caminhos completos como:
   *
   * /api/v1/auth
   * /api/v1/health
   */
  app.setGlobalPrefix("");

  /**
   * Pipe global de validação.
   *
   * Aplica validação automática em todos os DTOs
   * usados nos controllers da aplicação.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Remove propriedades que não existem no DTO.
       *
       * Isso evita que usuários enviem campos
       * inesperados para a aplicação.
       */
      whitelist: true,

      /**
       * Se o cliente enviar propriedades não permitidas,
       * a requisição será rejeitada com erro 400.
       */
      forbidNonWhitelisted: true,

      /**
       * Converte automaticamente tipos primitivos
       * quando possível.
       *
       * Exemplo:
       * "123" → number
       */
      transform: true,
    }),
  );

  /**
   * Porta onde a API será executada.
   *
   * Usa variável de ambiente se disponível,
   * senão utiliza 3001 como fallback.
   */
  const port = Number(process.env.API_PORT ?? 3001);

  /**
   * Inicializa o servidor HTTP.
   */
  await app.listen(port);

  /**
   * Log simples indicando que a API iniciou.
   */
  console.log(`API running on http://localhost:${port}`);
}

/**
 * Executa o bootstrap da aplicação.
 *
 * O uso de `void` evita warnings de promessa
 * não tratada no runtime.
 */
void bootstrap();
