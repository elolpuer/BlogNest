import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path';
import * as hbs from 'hbs';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connect from 'connect-redis'
import * as config from 'config'
import * as passport from 'passport'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisClient = redis.createClient()
  const redisStore = connect(session)

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: '/layouts/main' });
  hbs.registerPartials(join(__dirname, "../", "/views/partials"));
  

  app.use(
    session({
    saveUninitialized:false,
    resave: false,
    secret: 'tss...it is a secret',
    cookie:{
        sameSite: true,
        secure: false
        },
    store: new redisStore({host: config.get('REDIS_HOST'), port: config.get('REDIS_PORT'), client: redisClient, ttl: '216000'})
      }
    )
  )
  app.use(express.static(join(__dirname, 'public')))
  app.use(passport.initialize());
  app.use(passport.session())
  
  await app.listen(config.get('PORT'));
}
bootstrap();
