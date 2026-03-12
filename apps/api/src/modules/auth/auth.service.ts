import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictException("Email already in use.");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await this.usersService.create({
      email: input.email,
      passwordHash,
    });

    return {
      user_id: user.id,
      email: user.email,
    };
  }

  async login(input: LoginDto) {
    const user = await this.usersService.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      expires_in: 3600,
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    return {
      user_id: user.id,
      email: user.email,
      created_at: user.createdAt,
    };
  }
}
