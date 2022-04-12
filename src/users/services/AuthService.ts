import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "../models/user";
import { UsersService } from "./UsersService";
import { JwtService } from '@nestjs/jwt';
import { cloneDeep } from "lodash";


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtTokenService: JwtService) { }

    /**
     * Validates User, creates or updates database and returns the jwt access token
     * @param user 
     */
    async authenticateUser(user: Partial<User>): Promise<any> {
        if (!user.name || !user.name.trim()) {
            throw new BadRequestException();
        }

        const newUser = await this.findByNameAndUpsert(user);
        return this.getJwtAccessToken({ user: newUser });
    }

    private async findByNameAndUpsert(user: Partial<User>): Promise<User> {
        const dbData = await this.usersService.retrieveByName(user.name as string);
        const exists: boolean = (dbData) ? true : false;
        const mergedUser = (exists) ? cloneDeep(dbData) : cloneDeep(user); // TODO RamdaJS

        mergedUser.last_login = new Date();
        mergedUser.online = true;

        const newUser = (!exists) ?
            await this.usersService.create(mergedUser) :
            await this.usersService.update(mergedUser);

        return newUser;
    }

    private getJwtAccessToken(payload: any) {
        return {
            access_token: this.jwtTokenService.sign(JSON.parse(JSON.stringify(payload)))
        };
    }

}
