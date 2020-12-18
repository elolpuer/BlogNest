import { Controller, Post, Req, Res, Get, Render, Body, Param, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request, Response } from 'express'
import { RenderPageDto } from 'src/dto/render-page-dto';
import { AddPostDto } from 'src/dto/add-post-dto';
import { AuthGuard } from '../guards/auth.guard'
import { CommentDto } from 'src/dto/comment-dto';

@Controller('blog')
export class BlogController {
    constructor (private readonly blogService: BlogService ){}

    @Get('posts')
    @Render('posts')
    async getPosts(@Req() req: Request): Promise<RenderPageDto> {
        const posts = await this.blogService.findAll(req.session.user.id)
        if (!posts) {
            return {title: 'Posts', user: req.session.user}
        }

        return {title: 'Posts', user: req.session.user,posts, allPosts: true}
    }

    @Get('post/:id')
    @Render('posts')
    async getPost(@Param() params, @Req() req: Request): Promise<RenderPageDto>{
        const onePost = await this.blogService.findPost(params.id)
        const comments = await this.blogService.findComments(params.id)
        return {title: params.username, user: req.session.user , post: onePost, username: req.session.user.username , comments ,allPosts:false}
    }


    @UseGuards(AuthGuard)
    @Get('add')
    @Render('add')
    async getAddPage(@Req() req: Request): Promise<RenderPageDto>{
        return {title: 'Add', user: req.session.user}
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async addPost(@Body() addPostDto: AddPostDto, @Req() req: Request, @Res() res: Response): Promise<any> {
        addPostDto.user_id = req.session.user.id
        addPostDto.username = req.session.user.username
        await this.blogService.addPost(addPostDto)
            .then(()=>{res.redirect('/blog/add')})
    }

    @UseGuards(AuthGuard)
    @Post(':id')
    async deletePost(@Param('id') id: string, @Res() res: Response): Promise<any> {
        await this.blogService.deletePost(id)
            .then(()=>{res.redirect('/blog/posts')})
    }

    @Get(':username')
    @Render('posts_another_user')
    async getAnotherUser(@Param() params, @Req() req: Request): Promise<RenderPageDto>{
        const anotherUserPosts = await this.blogService.getAnotherUserPosts(params.username)
        return {title: params.username, user: req.session.user ,posts: anotherUserPosts, username: params.username, allPosts: true}
    }

    @Get(':username/:id')
    @Render('posts_another_user')
    async getAnotherUserPost(@Param() params, @Req() req: Request): Promise<RenderPageDto>{
        const anotherUserPost = await this.blogService.findPost(params.id)
        const comments = await this.blogService.findComments(params.id)
        return {title: params.username, user: req.session.user , post: anotherUserPost, username: params.username , comments ,allPosts:false}
    }

    @UseGuards(AuthGuard)
    @Post(':username/:id')
    async addComment(@Param() params, @Body() commentDto: CommentDto,@Req() req: Request, @Res() res: Response): Promise<void> {
        const newCommentDto = {
            post_id: params.id,
            text: commentDto.text,
            username: req.session.user.username
        }
        await this.blogService.addComment(newCommentDto)
            .then(()=>{res.redirect(`/blog/${req.params.username}/${req.params.id}`)})
    }
}
