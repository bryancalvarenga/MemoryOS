import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");
        const expiresIn = configService.get<string>("JWT_EXPIRES_IN");

        if (!secret || !expiresIn) {
          throw new Error("JWT configuration is missing.");
        }

        const signOptions: JwtSignOptions = {
          expiresIn: expiresIn as JwtSignOptions["expiresIn"],
        };

        return {
          secret,
          signOptions,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
