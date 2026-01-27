import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { LinkedInAccount } from '../entities/linkedin-account.entity';

@Module({
  imports: [
    // Need to import the Database Tables here
    TypeOrmModule.forFeature([User, UserPreference, LinkedInAccount]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // If it needs to be used by other Modules
})
export class UsersModule {}