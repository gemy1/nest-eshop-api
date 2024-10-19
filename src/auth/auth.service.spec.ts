/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from '../users/entity/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../users/dtos/login-user.dto';

jest.mock('argon2');
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  // mock the dependencies
  const mockUserService: Partial<UsersService> = {
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService: Partial<JwtService> = {
    signAsync: jest.fn().mockResolvedValue('jwtToken'),
    verifyAsync: jest
      .fn()
      .mockResolvedValue({ id: 1, email: 'test@email.com', username: 'test' }),
  };

  const mockConfigService: Partial<ConfigService> = {
    get: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new AuthService', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userDetails: CreateUserDto = {
        email: 'test@example.com',
        password: 'test',
        username: 'testUser',
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(usersService, 'create').mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
        username: 'testUser',
      } as User);
      jest.spyOn(service, 'getTokens').mockResolvedValue({
        accessToken: 'jwtToken',
        refreshToken: 'jwtToken',
      });
      jest.spyOn(service, 'updateRefreshToken').mockImplementation();

      const result = await service.register(userDetails);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        userDetails.email,
      );

      expect(usersService.create).toHaveBeenCalledWith({
        ...userDetails,
        password: 'hashedPassword',
      });
      expect(service.getTokens).toHaveBeenCalled();
      expect(service.updateRefreshToken).toHaveBeenCalledWith(1, 'jwtToken');
      expect(result).toEqual({
        accessToken: 'jwtToken',
        refreshToken: 'jwtToken',
      });
    });

    it('should throw an error if the user already exists', async () => {
      const userDetails: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User);

      await expect(service.register(userDetails)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user with valid credentials', async () => {
      const userDetails: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true); // Mock password comparison
      jest.spyOn(service, 'getTokens').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue(null);

      const result = await service.login(userDetails);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        userDetails.email,
      );
      expect(service.getTokens).toHaveBeenCalled();
      expect(service.updateRefreshToken).toHaveBeenCalledWith(
        1,
        'refresh-token',
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      const userDetails: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.login(userDetails)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  it('should sign out   a user', async () => {
    const id = 3;
    jest.spyOn(usersService, 'update').mockImplementation();

    const res = await service.logout(id);

    expect(usersService.update).toHaveBeenCalledWith(id, {
      refreshToken: null,
    });
    expect(res).toEqual({ message: 'Logged out' });
  });
});
