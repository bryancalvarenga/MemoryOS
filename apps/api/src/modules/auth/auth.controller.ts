import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type AuthenticatedRequest = {
  user: {
    userId: string;
    email: string;
  };
};

@Controller("/api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("/login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user.userId);
  }
}
