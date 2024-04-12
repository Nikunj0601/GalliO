import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';
import { AWSServicesService } from 'src/awsServices/awsServices.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly awsServicesService: AWSServicesService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, id: user.id };
    const expiresIn = '7d';
    return {
      ...user,
      access_token: this.jwtService.sign(payload, { expiresIn }),
    };
  }

  async signup(user: User) {
    const createdUser: User = await this.userService.createUser(user);
    const payload = { username: createdUser.email, id: createdUser.id };
    await this.awsServicesService.subscribeEmailtoSNS(
      'nikunjhudka123@gmail.com',
    );
    await this.awsServicesService.subscribeEmailtoSNS(createdUser.email);
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, { secret: 'secret' });
  }
}
