import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.userService.create(registerDto);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  async login(user: any): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (user && await this.userService.validatePassword(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    
    return null;
  }
}
