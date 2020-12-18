import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Post, User, Comment])],
  providers: [BlogService],
  controllers: [BlogController]
})
export class BlogModule {}
