import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadata global da aplicação.
 *
 * No Next.js App Router, o objeto `metadata`
 * define informações usadas para SEO e para
 * geração automática de tags no <head>.
 *
 * Essas informações serão aplicadas a todas
 * as páginas da aplicação, a menos que alguma
 * página defina metadata própria.
 */
export const metadata: Metadata = {
  title: "MemoryOS",

  /**
   * Descrição usada por:
   * - motores de busca
   * - preview de links (Discord, Twitter, etc)
   * - SEO geral da aplicação
   */
  description: "Personal knowledge memory system",
};

/**
 * RootLayout é o layout raiz da aplicação Next.js.
 *
 * No App Router, todo o conteúdo da aplicação
 * é renderizado dentro deste layout.
 *
 * Aqui normalmente configuramos:
 * - estrutura base do HTML
 * - providers globais
 * - temas
 * - fontes
 * - analytics
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /**
     * Define o idioma principal da aplicação.
     * Importante para acessibilidade e SEO.
     *
     * No futuro podemos tornar dinâmico se
     * MemoryOS suportar i18n.
     */
    <html lang="en">
      <body>
        {/**
         * `children` representa o conteúdo da rota atual.
         *
         * Exemplo:
         * /dashboard
         * /memory
         * /settings
         *
         * Cada página será renderizada aqui dentro.
         */}
        {children}
      </body>
    </html>
  );
}
