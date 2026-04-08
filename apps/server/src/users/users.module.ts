import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { WargamingModule } from '../wargaming/wargaming.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WargamingModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
