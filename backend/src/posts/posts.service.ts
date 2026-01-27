import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '../entities/post.entity';
import axios from 'axios';

@Injectable()
export class PostsService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,

    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
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
      - Use engaging Emojis throughout the text (at least 3-4 emojis).
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


  async publishPost(userId: number, content: string) {
    // Get User and Token details
    const user = await this.usersService.findOne(userId);
    const linkedinAccount = user.linkedinAccount;
    const accessToken = linkedinAccount.oauthToken?.access_token;

    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    // Format Author URN correctly
    let authorUrn = linkedinAccount.linkedin_urn;
    if (!authorUrn.startsWith('urn:li:person:')) {
      authorUrn = `urn:li:person:${authorUrn}`;
    }

    try {
      console.log('Publishing to LinkedIn...'); // Debug log

      // Body to send to LinkedIn API
      const postBody = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      // API Call
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        postBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('LinkedIn Response:', response.data); // Logs if successful

      const linkedinPostId = response.data.id;

      // Save to Database (Success)
      const newPost = this.postsRepository.create({
        content: content,
        linkedin_post_id: linkedinPostId,
        status: 'published',
        linkedinAccount: linkedinAccount,
      });
      return await this.postsRepository.save(newPost);

    } catch (error) {
      // Detailed error logging
      console.error('LinkedIn Publish Error Details:', error.response?.data || error.message);
      
      const failedPost = this.postsRepository.create({
        content: content,
        status: 'failed',
        linkedinAccount: linkedinAccount,
      });
      await this.postsRepository.save(failedPost);

      throw new Error('Failed to publish to LinkedIn.');
    }
  }

  // 4. Function to get User's Post History
  async getPostsByUser(userId: number) {
    return this.postsRepository.find({
      where: { linkedinAccount: { user: { id: userId } } },
      order: { created_at: 'DESC' }, // Show newest ones first
    });
  }
}