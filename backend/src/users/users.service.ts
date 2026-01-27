import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>,
  ) {}

  // Function to find a user
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['linkedinAccount', 'preference'], // Get with preferences too
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Function to save or update Preferences
  async savePreferences(userId: number, dto: CreatePreferenceDto) {
    const user = await this.findOne(userId);

    // Check if preferences already exist
    let preference = await this.preferenceRepository.findOne({
      where: { user: { id: userId } },
    });

    if (preference) {
      // Update existing
      preference = this.preferenceRepository.merge(preference, dto);
    } else {
      // Create new
      preference = this.preferenceRepository.create({
        ...dto,
        user: user,
      });
    }

    return this.preferenceRepository.save(preference);
  }
}