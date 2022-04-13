import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "../models/user";
import { UsersRepository } from "../repositories/users.repository";
import { UsersService } from "./UsersService";


describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        // Create a fake users repository
        const fakeUsersRepository: Partial<UsersRepository> = {
            retrieve: () => Promise.resolve(
                [
                    { _id: "1", name: "User1" } as unknown as User,
                    { _id: "2", name: "User2" } as unknown as User,
                    { _id: "3", name: "User3" } as unknown as User
                ]),
            retrieveByName: (name: string) => Promise.resolve({ _id: "1", name } as unknown as User),
            create: (user: Partial<User>) => Promise.resolve({ _id: "1", name: user.name } as unknown as User),
            update: (id: string, changes: Partial<User>) => Promise.resolve({ _id: "1", name: changes.name } as unknown as User)
        }

        // Create the DI container
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: UsersRepository, useValue: fakeUsersRepository }
            ]
        }).compile();

        service = module.get(UsersService);
    });

    it('Can create an instance of User Service', async () => {
        expect(service).toBeDefined();
    });

    it('Returns user list', async () => {
        const list = await service.retrieve();
        expect(list).toHaveLength(3);
    });

});
