import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { JWT_SECRET } from "../../common/config";
import { User } from "../models/user";
import { AuthService } from "./AuthService";
import { UsersService } from "./UsersService";

let service: AuthService;

describe('AuthService', () => {
    beforeEach(async () => {
        // Create a fake users service
        const fakeUsersService: Partial<UsersService> = {
            retrieveByName: (name: string) => Promise.resolve({ _id: "1", name } as unknown as User),
            create: (user: Partial<User>) => Promise.resolve({ _id: "1", name: user.name } as unknown as User),
            update: (user: Partial<User>) => Promise.resolve({ _id: "1", name: user.name } as unknown as User)
        }

        // Create the DI container
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: JWT_SECRET,
                    signOptions: { expiresIn: '1 day' }
                }),
            ],
            providers: [
                AuthService,
                { provide: UsersService, useValue: fakeUsersService }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('Can create an instance of Auth Service', async () => {
        expect(service).toBeDefined();
    });

    it('Throws an error if invalid user name', async () => {
        try {
            await service.authenticateUser({ name: "          " });
        } catch (error) {
            const { response: { message } } = error;
            expect(message).toEqual("Bad Request");
        }
    });

    it('Authenticates user and returns an access token', async () => {
        const results = await service.authenticateUser({ name: "Esteban" });
        expect(results.access_token).toBeDefined();
    });
});
