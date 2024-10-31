import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { dbConfig } from '../typeOrm.config';
import { ProductModule } from './product/product.module';
import { AdminSeederModule } from './seed/admin-seeder.module';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     configService.get('database'),
    // }),
    TypeOrmModule.forRoot(dbConfig as any),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    CategoryModule,
    AuthModule,
    ProductModule,
    AdminSeederModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    AppService,
  ],
})
export class AppModule {}
