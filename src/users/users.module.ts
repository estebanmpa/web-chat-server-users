import { CacheModule, Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from "./schemas/users.schema";
import { UsersService } from "./services/UsersService";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/AuthService";
import { JwtModule } from "@nestjs/jwt";
import { UsersGateway } from "./sockets/usersGateway";
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { CacheService } from "./services/CacheService";
import { ConfigModule, ConfigService } from "@nestjs/config";

const controllers = [UsersController, AuthController];
const providers = [UsersRepository, UsersService, AuthService, UsersGateway, CacheService];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "User", schema: UsersSchema }
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('jwtSecret'),
                    signOptions: { expiresIn: '1 day' }
                }
            },
            inject: [ConfigService],
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    store: redisStore,
                    url: configService.get('cache.connectionString')
                }
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [...controllers],
    providers: [...providers]
})
export class UsersModule { }