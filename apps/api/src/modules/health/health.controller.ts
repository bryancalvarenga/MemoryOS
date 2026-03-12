import { Controller, Get } from "@nestjs/common";

/**
 * Controller responsável pelos endpoints de saúde da aplicação.
 *
 * Esses endpoints são utilizados principalmente por:
 *
 * - Docker healthcheck
 * - Kubernetes liveness/readiness probes
 * - serviços de monitoramento
 * - load balancers
 *
 * Eles permitem que a infraestrutura verifique se a API está viva
 * e pronta para receber requisições.
 */
@Controller()
export class HealthController {
  /**
   * Endpoint de "liveness".
   *
   * Indica que a aplicação está rodando.
   * Não verifica dependências externas (ex: banco).
   *
   * Normalmente utilizado por:
   * - Kubernetes livenessProbe
   * - monitoramento simples
   *
   * Retorna informações básicas úteis para debugging.
   */
  @Get("/api/v1/health")
  getHealth() {
    return {
      status: "ok",

      // Nome do serviço ajuda em ambientes distribuídos
      // onde múltiplos serviços respondem health checks
      service: "memoryos-api",

      // Timestamp ajuda a verificar se a resposta é atual
      // e pode auxiliar em debugging de latência e caching
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Endpoint de "readiness".
   *
   * Indica que a aplicação está pronta para receber tráfego.
   * Diferente do health, aqui normalmente verificamos:
   *
   * - conexão com banco
   * - conexão com cache
   * - serviços externos necessários
   *
   * Atualmente retorna apenas "ready",
   * mas no futuro pode incluir verificações reais.
   */
  @Get("/api/v1/ready")
  getReadiness() {
    return {
      status: "ready",
    };
  }
}
