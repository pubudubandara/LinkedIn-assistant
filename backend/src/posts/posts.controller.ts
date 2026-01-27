import { Controller, Post, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
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
}