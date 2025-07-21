import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get dashboard statistics for admin overview
   */
  async getDashboardStats(admin: any) {
    const totalUsers = await this.userRepository.count();
    const adminCount = await this.userRepository.count({ where: { role: UserRole.ADMIN } });
    const managerCount = await this.userRepository.count({ where: { role: UserRole.MANAGER } });
    const employeeCount = await this.userRepository.count({ where: { role: UserRole.EMPLOYEE } });

    return {
      message: 'Admin dashboard stats',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      statistics: {
        totalUsers,
        roleDistribution: {
          admins: adminCount,
          managers: managerCount,
          employees: employeeCount,
        },
        systemStatus: 'Active',
        lastLogin: new Date().toISOString(),
      },
    };
  }

  /**
   * Get system settings (Admin only)
   */
  async getSystemSettings() {
    return {
      message: 'System settings retrieved',
      settings: {
        maintenanceMode: false,
        userRegistrationEnabled: true,
        passwordPolicy: {
          minLength: 6,
          requireNumbers: true,
          requireSpecialChars: false,
        },
        jwtExpirationTime: '7d',
        maxLoginAttempts: 5,
        systemVersion: '1.0.0',
      },
    };
  }

  /**
   * Get all users with detailed information (Admin only)
   */
  async getAllUsersDetailed(admin: any) {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at', 'updated_at'],
      order: { created_at: 'DESC' },
    });

    return {
      message: 'All users retrieved successfully',
      admin: admin.email,
      totalUsers: users.length,
      users,
    };
  }

  /**
   * Create user with specific role (Admin only)
   */
  async createUserWithRole(createUserDto: any, admin: any) {
    const { email, password, first_name, last_name, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    // Hash password (simplified for example)
    const hashedPassword = password; // In real implementation, use bcrypt

    const user = this.userRepository.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      role: role || UserRole.EMPLOYEE,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'User created successfully',
      admin: admin.email,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
        role: savedUser.role,
      },
    };
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId: number, newRole: UserRole, admin: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admin from changing their own role
    if (user.id === admin.id) {
      throw new ForbiddenException('Cannot change your own role');
    }

    user.role = newRole;
    await this.userRepository.save(user);

    return {
      message: 'User role updated successfully',
      admin: admin.email,
      updatedUser: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: number, admin: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admin from deleting themselves
    if (user.id === admin.id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
      admin: admin.email,
      deletedUser: {
        id: userId,
        email: user.email,
      },
    };
  }

  /**
   * Get audit logs (Admin only)
   */
  async getAuditLogs(admin: any) {
    // Mock audit log data - in real implementation, you'd have an audit log table
    return {
      message: 'Audit logs retrieved',
      admin: admin.email,
      logs: [
        {
          id: 1,
          action: 'User Login',
          user: 'john@example.com',
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.100',
        },
        {
          id: 2,
          action: 'Role Updated',
          user: 'admin@lrms.com',
          details: 'Changed user role from EMPLOYEE to MANAGER',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ipAddress: '192.168.1.101',
        },
      ],
    };
  }

  /**
   * Update system configuration (Admin only)
   */
  async updateSystemConfig(configData: any, admin: any) {
    // Mock system config update - in real implementation, you'd have a config table
    return {
      message: 'System configuration updated successfully',
      admin: admin.email,
      updatedConfig: configData,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate system reports (Admin only)
   */
  async generateSystemReport(reportType: string, admin: any) {
    const reports = {
      users: await this.generateUserReport(),
      activity: await this.generateActivityReport(),
      security: await this.generateSecurityReport(),
    };

    return {
      message: `${reportType} report generated successfully`,
      admin: admin.email,
      reportType,
      data: reports[reportType as keyof typeof reports] || { error: 'Report type not found' },
      generatedAt: new Date().toISOString(),
    };
  }

  private async generateUserReport() {
    const totalUsers = await this.userRepository.count();
    const roleStats = {
      admins: await this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      managers: await this.userRepository.count({ where: { role: UserRole.MANAGER } }),
      employees: await this.userRepository.count({ where: { role: UserRole.EMPLOYEE } }),
    };

    return { totalUsers, roleStats };
  }

  private async generateActivityReport() {
    return {
      totalLogins: 150,
      activeUsers: 45,
      newRegistrations: 12,
    };
  }

  private async generateSecurityReport() {
    return {
      failedLoginAttempts: 5,
      suspiciousActivities: 0,
      passwordResets: 3,
    };
  }
}
