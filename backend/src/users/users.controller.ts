import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. Get user details (GET http://localhost:3000/users/1)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // 2. Save Preferences (POST http://localhost:3000/users/1/preferences)
  @Post(':id/preferences')
  async savePreferences(
    @Param('id') id: string,
    @Body() createPreferenceDto: CreatePreferenceDto,
  ) {
    return this.usersService.savePreferences(+id, createPreferenceDto);
  }

  // DELETE http://localhost:3000/users/1
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}