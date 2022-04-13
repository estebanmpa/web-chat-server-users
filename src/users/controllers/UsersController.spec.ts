import { Test } from "@nestjs/testing";
import { User } from "../models/user";
import { UsersService } from "../services/UsersService";
import { UsersController } from "./users.controller";


describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const fakeUsersService: Partial<UsersService> = {
            retrieve: () => Promise.resolve(
                [
                    { _id: "1", name: "User1" } as unknown as User,
                    { _id: "2", name: "User2" } as unknown as User,
                    { _id: "3", name: "User3" } as unknown as User
                ])
        }

        // Create the DI container
        const module = await Test.createTestingModule({
            providers: [
                { provide: UsersService, useValue: fakeUsersService }
            ],
            controllers: [UsersController]
        }).compile();

        controller = module.get(UsersController);
    });

    it('Can create an instance of Users Controller', async () => {
        expect(controller).toBeDefined();
    });

    it('Returns users list', async () => {
        const list = await controller.retrieve();
        expect(list).toHaveLength(3);
    });

});