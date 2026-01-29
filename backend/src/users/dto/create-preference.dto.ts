import { IsString, IsNotEmpty, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @MinLength(2, { message: 'Role must be at least 2 characters long' })
  @MaxLength(100, { message: 'Role must not exceed 100 characters' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'Goals are required' })
  @MinLength(10, { message: 'Goals must be at least 10 characters long' })
  @MaxLength(500, { message: 'Goals must not exceed 500 characters' })
  goals: string;

  @IsString()
  @IsNotEmpty({ message: 'Challenges are required' })
  @MinLength(10, { message: 'Challenges must be at least 10 characters long' })
  @MaxLength(500, { message: 'Challenges must not exceed 500 characters' })
  challenges: string;

  @IsString()
  @IsNotEmpty({ message: 'Target country is required' })
  @MinLength(2, { message: 'Target country must be at least 2 characters long' })
  @MaxLength(100, { message: 'Target country must not exceed 100 characters' })
  target_country: string;

  @IsString()
  @IsNotEmpty({ message: 'Content tone is required' })
  @IsIn(['Professional', 'Casual', 'Inspirational', 'Funny'], {
    message: 'Content tone must be one of: Professional, Casual, Inspirational, Funny'
  })
  content_tone: string;
}