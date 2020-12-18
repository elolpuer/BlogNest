import { Controller, Get, Render, Req, Post, Res, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/user-dto';
import { Request, Response } from 'express'
import { RenderPageDto } from 'src/dto/render-page-dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}
    
    @Get()
    @Render('users')
    async getUsers(@Req() req: Request): Promise<RenderPageDto>{
        if (req.session.user) {
            const users = await this.usersService.findAll(req.session.user.id)
            return {title: 'Users', user: req.session.user, users}
        }
        const users = await this.usersService.findAll()
        return {title: 'Users', user: req.session.user, users}
        
    }


    @UseGuards(AuthGuard)
    @Get('me')
    @Render('me')
    async getMe(@Req() req: Request): Promise<RenderPageDto>{
        return {title: req.session.user.username, user: req.session.user}
    }

    @UseGuards(AuthGuard)
    @Post('me/:id')
    async deleteUser(@Param('id') id: string,@Req() req: Request ,@Res() res: Response): Promise<void> {
        await this.usersService.deleteUser(id)
        await delete req.session.user
        res.redirect('/')
    }


    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        if (req.session.user) {
            await delete req.session.user
            res.redirect('/')
        }
    }

    
}
