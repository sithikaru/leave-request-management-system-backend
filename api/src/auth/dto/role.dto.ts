import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserRoleDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
