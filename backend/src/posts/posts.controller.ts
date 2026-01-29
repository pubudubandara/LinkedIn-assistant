import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('posts')
@UseGuards(AuthenticatedGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('generate/:userId')
  async generatePost(@Param('userId') userId: string) {
    return this.postsService.generatePost(+userId);
  }

  // POST http://localhost:3000/posts/publish/1
  @Post('publish/:userId')
  async publishPost(
    @Param('userId') userId: string,
    @Body('content') content: string, // Get content from Body
  ) {
    return this.postsService.publishPost(+userId, content);
  }

  // GET http://localhost:3000/posts/history/1
  @Get('history/:userId')
  async getPostHistory(@Param('userId') userId: string) {
    return this.postsService.getPostsByUser(+userId);
  }
}