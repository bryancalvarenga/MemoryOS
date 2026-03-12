/**
 * Tipo que define a estrutura do payload contido
 * dentro dos tokens JWT gerados pela aplicação.
 *
 * O payload é a parte do token que contém
 * informações sobre o usuário autenticado.
 *
 * Exemplo de payload real dentro de um JWT:
 *
 * {
 *   "sub": "b8f5f8c2-4c4c-4c3c-8f0c-123456789abc",
 *   "email": "user@email.com",
 *   "iat": 1710000000,
 *   "exp": 1710003600
 * }
 */
export type JwtPayload = {
  /**
   * Subject do token.
   *
   * No padrão JWT, "sub" representa o identificador
   * principal da entidade autenticada.
   *
   * Aqui usamos o UUID do usuário.
   */
  sub: string;

  /**
   * Email do usuário autenticado.
   *
   * Incluímos no payload para facilitar acesso
   * rápido a informações básicas sem precisar
   * consultar o banco em todas as requisições.
   */
  email: string;
};
