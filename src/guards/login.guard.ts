import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const user = request.session.user
    if (!user){
        return true
    }
    throw new HttpException('Already login', HttpStatus.CREATED);
  }
}