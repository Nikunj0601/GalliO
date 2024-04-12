import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async createUser(user: User): Promise<User> {
    const checkNewEmail = await this.getUser(user.email);
    if (checkNewEmail) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }
    const createUser = this.userRepository.create(user);
    return await this.userRepository.save(createUser);
  }
}
