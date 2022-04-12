import { Body, Controller, Post } from "@nestjs/common";
import { User } from "../models/user";
import { AuthService } from "../services/AuthService";


@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @Post()
    async auth(@Body() user: Partial<User>): Promise<any> {
        return this.service.authenticateUser(user);
    }

}

