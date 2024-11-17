import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    if (!allowUnauthorizedRequest && !request.session?.user) {
      response.redirect('/admin/sign-in');
    }
    return true;
  }
}
