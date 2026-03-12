import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

/**
 * Tipo que representa uma requisição autenticada.
 *
 * Depois que o JwtAuthGuard valida o token,
 * o objeto `request.user` é preenchido pela JwtStrategy.
 *
 * Definimos esse tipo para manter tipagem segura no controller.
 */
type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

/**
 * Controller responsável pelos endpoints de autenticação.
 *
 * Aqui ficam as rotas HTTP relacionadas a:
 * - registro de usuário
 * - login
 * - recuperação do usuário autenticado
 *
 * Importante:
 * Controllers apenas recebem a requisição e delegam
 * a lógica de negócio para os services.
 */
@Controller("/api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de registro de usuário.
   *
   * POST /api/v1/auth/register
   *
   * Espera receber um payload compatível com RegisterDto:
   *
   * {
   *   "email": "user@email.com",
   *   "password": "password123"
   * }
   */
  @Post("/register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  /**
   * Endpoint de login.
   *
   * POST /api/v1/auth/login
   *
   * Fluxo:
   * 1. valida credenciais
   * 2. gera token JWT
   * 3. retorna token para o cliente
   */
  @Post("/login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  /**
   * Endpoint que retorna dados do usuário autenticado.
   *
   * GET /api/v1/auth/me
   *
   * Este endpoint é protegido pelo JwtAuthGuard,
   * portanto exige um token válido no header:
   *
   * Authorization: Bearer <token>
   */
  @UseGuards(JwtAuthGuard)
  @Get("/me")
  me(@Req() request: AuthenticatedRequest) {
    /**
     * O ID do usuário vem do token JWT validado
     * pela JwtStrategy e anexado ao request.
     */
    return this.authService.me(request.user.userId);
  }
}
