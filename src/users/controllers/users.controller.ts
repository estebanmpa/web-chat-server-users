import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "../models/user";
import { UsersService } from "../services/UsersService";


@Controller("users")
export class UsersController {
    constructor(private service: UsersService) { }

    @Get()
    async retrieve(): Promise<User[]> {
        return this.service.retrieve();
    }
}