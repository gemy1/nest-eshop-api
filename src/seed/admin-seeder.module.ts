import { Module } from '@nestjs/common';
import { AdminSeederService } from './admin-seeder.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AdminSeederService],
  imports: [AuthModule],
})
export class AdminSeederModule {}
