import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../shared/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const result = { access_token: 'some_jwt_token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login({ body: loginDto })).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'login').mockImplementation(() => {
        throw new UnauthorizedException('Invalid credentials');
      });

      try {
        await authController.login({ body: loginDto });
      } catch (error) {
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    it('should throw an InternalServerErrorException on internal error', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };

      jest.spyOn(authService, 'login').mockImplementation(() => {
        throw new InternalServerErrorException('Internal server error');
      });

      try {
        await authController.login({ body: loginDto });
      } catch (error) {
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe('Internal server error');
      }
    });
  });
});
