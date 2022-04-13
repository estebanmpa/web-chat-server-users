import { Test } from "@nestjs/testing";
import { User } from "../models/user";
import { AuthService } from "../services/AuthService";
import { AuthController } from "./auth.controller";


describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const fakeAuthService: Partial<AuthService> = {
            authenticateUser: (user: Partial<User>) => Promise.resolve({ access_token: "example" })
        }

        // Create the DI container
        const module = await Test.createTestingModule({
            providers: [
                { provide: AuthService, useValue: fakeAuthService }
            ],
            controllers: [AuthController]
        }).compile();

        controller = module.get(AuthController);
    });

    it('Can create an instance of Auth Controller', async () => {
        expect(controller).toBeDefined();
    });

    it('Authenticates user and returns an access token', async () => {
        const results = await controller.auth({ name: "Esteban" });
        expect(results.access_token).toBeDefined();
    });

});