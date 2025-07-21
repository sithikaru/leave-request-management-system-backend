import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UpdateUserRoleDto } from '../auth/dto/role.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, first_name, last_name, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const user = this.userRepository.create({
      email,
      password_hash,
      first_name,
      last_name,
      role,
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role',
        'created_at',
        'updated_at',
      ],
    });
  }

  async updateUserRole(
    updateUserRoleDto: UpdateUserRoleDto,
    adminUser: any,
  ): Promise<User> {
    const { userId, role } = updateUserRoleDto;

    // Only admins can assign roles
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can assign roles');
    }

    // Find the user to update
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admins from changing their own role
    if (user.id === adminUser.id) {
      throw new ForbiddenException('Cannot change your own role');
    }

    // Update the user's role
    user.role = role;
    return await this.userRepository.save(user);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.find({
      where: { role },
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role',
        'created_at',
        'updated_at',
      ],
    });
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'role',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
