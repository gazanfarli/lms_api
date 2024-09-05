import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found with these credentials');
    }

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const jwtPayload = { sub: user.userId, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }
}
