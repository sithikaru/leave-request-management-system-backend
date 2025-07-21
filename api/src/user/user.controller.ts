import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../entities/user.entity';
import { UpdateUserRoleDto } from '../auth/dto/role.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<User> {
    return await this.userService.getUserProfile(user.id);
  }

  @Get('role/:role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getUsersByRole(@Param('role') role: UserRole): Promise<User[]> {
    return await this.userService.getUsersByRole(role);
  }

  @Put('role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Body(ValidationPipe) updateUserRoleDto: UpdateUserRoleDto,
    @CurrentUser() adminUser: any,
  ): Promise<{ message: string; user: User }> {
    const updatedUser = await this.userService.updateUserRole(
      updateUserRoleDto,
      adminUser,
    );
    return {
      message: 'User role updated successfully',
      user: updatedUser,
    };
  }
}
