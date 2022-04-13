import { CacheModule, Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from "./schemas/users.schema";
import { UsersService } from "./services/UsersService";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/AuthService";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET, REDIS_CONNECTION_STRING } from "src/common/config";
import { UsersGateway } from "./sockets/usersGateway";
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { CacheService } from "./services/CacheService";

const controllers = [UsersController, AuthController];
const providers = [UsersRepository, UsersService, AuthService, UsersGateway, CacheService];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "User", schema: UsersSchema }
        ]),
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1 day' }
        }),
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: REDIS_CONNECTION_STRING,
            
          }),
    ],
    controllers: [...controllers],
    providers: [...providers]
})
export class UsersModule { }