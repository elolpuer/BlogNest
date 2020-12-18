import { Controller, Get, Render, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RenderPageDto } from 'src/dto/render-page-dto';
import { LoginUserDto } from 'src/dto/login-user-dto';
import { CreateUserDto } from 'src/dto/create-user-dto';
import { LoginGuard } from 'src/guards/login.guard';

@UseGuards(LoginGuard)
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Get('login')
    @Render('login')
    loginPage(): RenderPageDto {
        return { title: 'Login' }
    } 

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response, @Req() req: Request): Promise<any>{
        try {
            await this.authService.login(loginUserDto, res)
                .then((user)=>{req.session.user = user})
                .then(()=>{res.redirect('/')})
        } catch (error) {
            console.error(error)
        }
        
    }

    @Get('register')
    @Render('register')
    registerPage(): RenderPageDto {
        return { title: 'Register'}
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response, @Req() req: Request): Promise<any> {
        await this.authService.createUser(createUserDto, res)
            .then(()=>{res.redirect('/auth/login')})
    }

}
