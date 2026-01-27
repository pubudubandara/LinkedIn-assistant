import { Controller, Post, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('generate/:userId')
  async generatePost(@Param('userId') userId: string) {
    return this.postsService.generatePost(+userId);
  }
}