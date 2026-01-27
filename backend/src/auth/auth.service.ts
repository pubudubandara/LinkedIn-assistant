import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LinkedInAccount } from '../entities/linkedin-account.entity';
import { OAuthToken } from '../entities/oauth-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LinkedInAccount) private linkedinAccountRepository: Repository<LinkedInAccount>,
    @InjectRepository(OAuthToken) private oauthTokenRepository: Repository<OAuthToken>,
  ) {}

  async validateUser(details: any) {
    // 1. Check if LinkedIn account exists
    let linkedinAccount = await this.linkedinAccountRepository.findOne({
      where: { linkedin_urn: details.linkedinId },
      relations: ['user', 'oauthToken'],
    });

    if (linkedinAccount) {
      // If user exists, update Profile Data and Token
      await this.updateAccountAndToken(linkedinAccount, details);
      return linkedinAccount.user;
    }

    // 2. If user doesn't exist, create a new one
    return this.createNewUser(details);
  }

  // Function to update data for existing users
  private async updateAccountAndToken(account: LinkedInAccount, details: any) {
    // Update Profile Data (Image is updated here)
    account.first_name = details.firstName;
    account.last_name = details.lastName;
    account.profile_image = details.picture; 
    await this.linkedinAccountRepository.save(account);

    // Update Token
    const token = account.oauthToken;
    token.access_token = details.accessToken;
    token.refresh_token = details.refreshToken || null;
    token.expires_in = details.expiresIn;
    await this.oauthTokenRepository.save(token);
  }

  // Function to create new users
  private async createNewUser(details: any) {
    // A. Create User
    const newUser = this.userRepository.create({
      email: details.email,
    });
    const savedUser = await this.userRepository.save(newUser);

    // B. Create LinkedIn Account
    const newAccount = this.linkedinAccountRepository.create({
      linkedin_urn: details.linkedinId,
      first_name: details.firstName,
      last_name: details.lastName,
      headline: '', 
      profile_image: details.picture, 
      user: savedUser,
    });
    const savedAccount = await this.linkedinAccountRepository.save(newAccount);

    // C. Create OAuth Token
    const newToken = this.oauthTokenRepository.create({
      access_token: details.accessToken,
      refresh_token: details.refreshToken || null,
      expires_in: details.expiresIn,
      linkedinAccount: savedAccount,
    });
    await this.oauthTokenRepository.save(newToken);

    return savedUser;
  }
}