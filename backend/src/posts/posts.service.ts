import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // Initialize Gemini API
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('FATAL ERROR: GEMINI_API_KEY is not defined in .env file!');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generatePost(userId: number) {
    // 1. Get User and Preferences
    const user = await this.usersService.findOne(userId);
    const prefs = user.preference;

    if (!prefs) {
      throw new NotFoundException('User preferences not found. Please set them first.');
    }

    // 2. Prepare the Prompt
    const prompt = `
      You are a professional LinkedIn content creator. Write a post for a user with these details:
      
      - Role: ${prefs.role}
      - Career Goals: ${prefs.goals}
      - Challenges: ${prefs.challenges}
      - Target Country: ${prefs.target_country}
      - Tone: ${prefs.content_tone}

      Instructions:
      - The post should be engaging and professional.
      -Use engaging Emojis throughout the text (at least 3-4 emojis).
      - Keep it under 200 words.
      - Add 3-5 relevant hashtags.
      - Do NOT allow any markdown formatting like **bold** or *italic*. Plain text only.
      - Do NOT include any introductory text like "Here is the post". Just give the post content directly.
    `;

    try {
      // 3. Send to Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        generated_at: new Date(),
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate post using Gemini AI.');
    }
  }
}