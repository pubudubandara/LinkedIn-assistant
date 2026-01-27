import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UsersModule } from '../users/users.module';
import { Post as PostEntity } from '../entities/post.entity'; 

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PostEntity]), 
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}