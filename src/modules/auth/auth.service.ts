import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import { IAuthContext } from 'src/types';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  async login(user: any) {
    if (user.pinId) return user;
    const payload: IAuthContext = {
      fullname: user.fullname,
      email: user.email,
      uuid: user.uuid,
    };
    await this.em.flush();
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: 1.2e6,
      user,
    };
  }

  async validateUser(emailOrPhone: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhone(emailOrPhone);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      if (user.deletedAt)
        throw new ForbiddenException('This account is disabled');
      return user;
    }
    throw new UnauthorizedException('Invalid details');
  }
}
