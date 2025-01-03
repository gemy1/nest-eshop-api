import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { OwnershipGuard } from '../guards/ownership.guard';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
    }),
    ProductModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_GUARD, useClass: OwnershipGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
