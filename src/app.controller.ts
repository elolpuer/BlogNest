import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RenderPageDto } from './dto/render-page-dto';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(@Req() req: Request): RenderPageDto {
    return {title: 'Index', user: req.session.user}
  }
}
