import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { validateEnv } from "./config/validate-env";
import { getTypeOrmConfig } from "./database/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthController } from "./modules/health/health.controller";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["apps/api/.env", ".env"],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>("DATABASE_URL");

        if (!databaseUrl) {
          throw new Error("DATABASE_URL is not configured.");
        }

        return getTypeOrmConfig(databaseUrl);
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
