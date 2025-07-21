import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../entities/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN) // All routes in this controller require ADMIN role
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Admin Dashboard - Get system overview
   * Protected: ADMIN only
   */
  @Get('dashboard')
  async getDashboard(@CurrentUser() admin: any) {
    return await this.adminService.getDashboardStats(admin);
  }

  /**
   * System Management - Get all system settings
   * Protected: ADMIN only
   */
  @Get('system-settings')
  async getSystemSettings() {
    return await this.adminService.getSystemSettings();
  }

  /**
   * User Management - Get all users with detailed information
   * Protected: ADMIN only
   */
  @Get('users')
  async getAllUsers(@CurrentUser() admin: any) {
    return await this.adminService.getAllUsersDetailed(admin);
  }

  /**
   * User Management - Create new user with any role
   * Protected: ADMIN only
   */
  @Post('users')
  async createUser(
    @Body(ValidationPipe) createUserDto: any,
    @CurrentUser() admin: any,
  ) {
    return await this.adminService.createUserWithRole(createUserDto, admin);
  }

  /**
   * User Management - Update user role (Admin privilege)
   * Protected: ADMIN only
   */
  @Put('users/:id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() roleData: { role: UserRole },
    @CurrentUser() admin: any,
  ) {
    return await this.adminService.updateUserRole(userId, roleData.role, admin);
  }

  /**
   * User Management - Delete user (Admin privilege)
   * Protected: ADMIN only
   */
  @Delete('users/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() admin: any,
  ) {
    return await this.adminService.deleteUser(userId, admin);
  }

  /**
   * System Logs - View system audit logs
   * Protected: ADMIN only
   */
  @Get('audit-logs')
  async getAuditLogs(@CurrentUser() admin: any) {
    return await this.adminService.getAuditLogs(admin);
  }

  /**
   * System Configuration - Update system-wide settings
   * Protected: ADMIN only
   */
  @Put('system-config')
  async updateSystemConfig(
    @Body() configData: any,
    @CurrentUser() admin: any,
  ) {
    return await this.adminService.updateSystemConfig(configData, admin);
  }

  /**
   * Reports - Generate comprehensive system reports
   * Protected: ADMIN only
   */
  @Get('reports/:type')
  async generateReport(
    @Param('type') reportType: string,
    @CurrentUser() admin: any,
  ) {
    return await this.adminService.generateSystemReport(reportType, admin);
  }
}
