import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
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

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at'],
    });
  }
}
