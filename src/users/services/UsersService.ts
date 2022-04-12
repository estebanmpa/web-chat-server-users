import { Injectable } from "@nestjs/common";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users.repository";


@Injectable()
export class UsersService {
    constructor(private UsersDB: UsersRepository) { }

    async retrieve(): Promise<User[]> {
        return this.UsersDB.retrieve();
    }

    async retrieveByName(name: string): Promise<User> {
        return this.UsersDB.retrieveByName(name);
    }

    async create(user: Partial<User>): Promise<User> {
        return this.UsersDB.create(user);
    }

    async update(user: Partial<User>): Promise<User> {
        return this.UsersDB.update(user._id as string, user);
    }
}
