import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { PostDto } from 'src/dto/post-dto';
import { AddPostDto } from 'src/dto/add-post-dto';
import { User } from 'src/entities/user.entity';
import { CommentDto } from 'src/dto/comment-dto';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>
    ){}

    async findAll(user_id: string): Promise<PostDto[]>{
        return await this.postRepository.find({user_id})
    }

    async addPost(addPostDto: AddPostDto): Promise<void> {
        const post = new Post
            post.text = addPostDto.text
            post.time = new Date
            post.date = new Date
            post.user_id = addPostDto.user_id
            post.username = addPostDto.username

        await this.postRepository.save(post)
    }

    async deletePost(id: string): Promise<void> {
        await this.postRepository.delete({id})
    }

    async getAnotherUserPosts(username: string): Promise<PostDto[]>{
        const user = await this.userRepository.findOne({username})
        return await this.postRepository.find({user_id: user.id})
    }

    async findPost(id: string): Promise<PostDto> {
        return await this.postRepository.findOne({id})
    }

    async addComment(commentDto: CommentDto): Promise<void> {
        const comment = new Comment
            comment.post_id = commentDto.post_id
            comment.text = commentDto.text
            comment.username = commentDto.username
            comment.time = new Date()
            comment.date = new Date()
        await this.commentRepository.save(comment)
    }

    async findComments(id: string): Promise<CommentDto[]>{
        return await this.commentRepository.find({post_id: id})
    }
}
