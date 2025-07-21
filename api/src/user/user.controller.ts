import { Controller, Get, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
