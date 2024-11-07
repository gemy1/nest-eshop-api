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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig as any),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'assets'),
      serveRoot: '/assets',
    }),
    UsersModule,
    CategoryModule,
    AuthModule,
    ProductModule,
    AdminSeederModule,
    ImageModule,
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
