import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { User } from "../models/user";
import { CacheService } from "../services/CacheService";
import { UsersService } from "../services/UsersService";

@Injectable()
@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class UsersGateway {
    constructor(private cache: CacheService,
        private users: UsersService) { }

    @WebSocketServer()
    server;

    handleConnection(client: any): void {
    }

    async handleDisconnect(client: any) {
        const { id } = client;
        const cachedUser: User = await this.cache.get(id) as User;
        if (cachedUser) {
            cachedUser.online = false;
            const userDb = await this.users.update(cachedUser);
            await this.cache.del(id);
            this.emitUser(userDb);
        }
    }

    /**
     * Relates the user with the current socket and mark as online
     * @param client socket data
     * @param data user data
     * @returns 
     */
    @SubscribeMessage('user_logged_in')
    async handleEvent(@ConnectedSocket() client: Socket,
        @MessageBody() data: string) {
        const { id } = client;
        const user: User = data as unknown as User;
        await this.cache.set(id, user);
        this.emitUser(user);
    }

    /**
     * Sends the notification for a new or an updated user 
     * @param user user data
     */
    emitUser(user: User): void {
        this.server.emit('new_or_updated_user', user);
    }

}
