import {
  Controller,
  Param,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/shared/public-route';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @Public()
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('/signup')
  @Public()
  async createUser(@Request() req) {
    return await this.authService.signup(req.body);
  }

  @Get('/verifyToken/:id')
  @Public()
  async verfiyToken(@Param() param: any) {
    return await this.authService.verifyToken(param.id);
  }
}
