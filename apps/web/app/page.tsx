/**
 * Busca o estado de saúde da API.
 *
 * Como esta página é um Server Component do Next.js,
 * essa função roda no servidor durante a renderização.
 * Isso é útil para validar integração backend/frontend
 * sem depender de JavaScript no cliente.
 */
async function getApiHealth() {
  /**
   * Normaliza a URL base da API removendo uma possível
   * barra final para evitar rotas duplicadas como:
   * http://localhost:3001//api/v1/health
   *
   * Fallback local para facilitar desenvolvimento.
   */
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:3001";

  try {
    /**
     * Faz uma chamada direta ao endpoint de health da API.
     *
     * `cache: 'no-store'` força o Next.js a não reutilizar
     * resposta em cache, garantindo que o status exibido
     * reflita o estado atual da API.
     *
     * Para health check isso faz sentido, porque queremos
     * informação fresca e não um valor antigo.
     */
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      cache: "no-store",
    });

    /**
     * Se a API respondeu, mas com status HTTP inválido,
     * tratamos como indisponível para simplificar a UI.
     *
     * Futuramente diferenciar melhor cenários como:
     * - 401/403
     * - 500
     * - timeout
     * - serviço parcialmente degradado
     */
    if (!response.ok) {
      return { status: "unavailable" };
    }

    /**
     * Faz o parse da resposta e aplica uma tipagem básica
     * para deixar explícito o contrato esperado desse endpoint.
     *
     * Isso ajuda a evitar ambiguidades na integração.
     */
    return (await response.json()) as {
      status: string;
      service?: string;
      timestamp?: string;
    };
  } catch {
    /**
     * Se ocorrer erro de rede, DNS, conexão recusada ou
     * qualquer falha no fetch, a UI continua funcional
     * e apenas exibe a API como indisponível.
     *
     * Isso é importante para resiliência do frontend.
     */
    return { status: "unavailable" };
  }
}

/**
 * Página inicial da aplicação.
 *
 * Como é uma função assíncrona no App Router,
 * podemos buscar dados no servidor antes de renderizar.
 *
 * Neste estágio do projeto, a home atua como:
 * - landing page técnica inicial
 * - validação visual do frontend
 * - verificação de integração com a API
 */
export default async function HomePage() {
  /**
   * Busca o estado atual da API antes de renderizar a página.
   */
  const health = await getApiHealth();

  return (
    <main
      style={{
        minHeight: "100vh",

        /**
         * Centraliza o conteúdo vertical e horizontalmente.
         * Bom para uma página inicial minimalista de estágio inicial.
         */
        display: "grid",
        placeItems: "center",

        /**
         * Tema visual provisório.
         * Depois isso deve migrar para tokens de design,
         * Tailwind ou sistema de tema centralizado.
         */
        background: "#0b1020",
        color: "#f5f7ff",
        padding: "2rem",
      }}
    >
      <section style={{ maxWidth: 720, width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>MemoryOS</h1>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.9 }}>
          Personal knowledge memory system designed to transform fragmented
          digital information into a searchable memory layer.
        </p>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem 1.25rem",

            /**
             * Card visual simples para destacar o estado
             * da integração com o backend.
             */
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <strong>API status:</strong> {health.status}
        </div>
      </section>
    </main>
  );
}
