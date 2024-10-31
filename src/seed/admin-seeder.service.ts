import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    const nodeEnv = await this.configService.get('NODE_ENV');

    const adminUser = {
      email: 'admin@admin.com',
      password: '111111',
      username: 'admin',
      role: 'admin',
    };

    if (nodeEnv === 'development') {
      try {
        await this.authService.register(adminUser);
        console.log('seed => Admin user created');
      } catch {
        console.log('seed => Admin user already exists');
      }
    }
  }
}
