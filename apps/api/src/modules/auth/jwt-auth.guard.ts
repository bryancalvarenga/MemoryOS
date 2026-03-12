import { AuthGuard } from "@nestjs/passport";

/**
 * Guard responsável por proteger rotas utilizando a estratégia JWT.
 *
 * Guards no NestJS atuam como um "gatekeeper" antes que o controller
 * seja executado. Eles podem permitir ou bloquear o acesso à rota.
 *
 * Este guard utiliza a estratégia registrada em `JwtStrategy`
 * (nomeada como 'jwt').
 *
 * Quando aplicado a um endpoint, ele executa o seguinte fluxo:
 *
 * 1. Extrai o token do header Authorization
 * 2. Valida o token usando JwtStrategy
 * 3. Se válido → adiciona `request.user`
 * 4. Se inválido/ausente → retorna 401 Unauthorized
 *
 * Exemplo de uso em um controller:
 *
 * @UseGuards(JwtAuthGuard)
 * @Get('/profile')
 * getProfile(@Req() req) {
 *   return req.user;
 * }
 */
export class JwtAuthGuard extends AuthGuard("jwt") {}
