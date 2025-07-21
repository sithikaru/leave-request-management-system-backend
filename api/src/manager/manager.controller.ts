import {
  Controller,
  Get,
  Post,
  Put,
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
import { ManagerService } from './manager.service';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER) // Both ADMIN and MANAGER can access
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  /**
   * Manager Dashboard - Get department overview
   * Protected: ADMIN, MANAGER
   */
  @Get('dashboard')
  async getDashboard(@CurrentUser() manager: any) {
    return await this.managerService.getDashboardStats(manager);
  }

  /**
   * Team Management - Get team members
   * Protected: ADMIN, MANAGER
   */
  @Get('team')
  async getTeamMembers(@CurrentUser() manager: any) {
    return await this.managerService.getTeamMembers(manager);
  }

  /**
   * Employee Management - Get employees under management
   * Protected: ADMIN, MANAGER
   */
  @Get('employees')
  async getEmployees(@CurrentUser() manager: any) {
    return await this.managerService.getEmployees(manager);
  }

  /**
   * Leave Requests - View team leave requests
   * Protected: ADMIN, MANAGER
   */
  @Get('leave-requests')
  async getLeaveRequests(@CurrentUser() manager: any) {
    return await this.managerService.getLeaveRequests(manager);
  }

  /**
   * Leave Management - Approve/Reject leave requests
   * Protected: ADMIN, MANAGER
   */
  @Put('leave-requests/:id/approve')
  async approveLeaveRequest(
    @Param('id', ParseIntPipe) requestId: number,
    @Body() approvalData: { approved: boolean; comments?: string },
    @CurrentUser() manager: any,
  ) {
    return await this.managerService.approveLeaveRequest(
      requestId,
      approvalData,
      manager,
    );
  }

  /**
   * Reports - Generate department reports
   * Protected: ADMIN, MANAGER
   */
  @Get('reports')
  async getDepartmentReports(@CurrentUser() manager: any) {
    return await this.managerService.getDepartmentReports(manager);
  }

  /**
   * Employee Evaluation - View employee performance
   * Protected: ADMIN, MANAGER
   */
  @Get('employees/:id/performance')
  async getEmployeePerformance(
    @Param('id', ParseIntPipe) employeeId: number,
    @CurrentUser() manager: any,
  ) {
    return await this.managerService.getEmployeePerformance(employeeId, manager);
  }

  /**
   * Schedule Management - View team schedules
   * Protected: ADMIN, MANAGER
   */
  @Get('schedules')
  async getTeamSchedules(@CurrentUser() manager: any) {
    return await this.managerService.getTeamSchedules(manager);
  }

  /**
   * Announcements - Create team announcements
   * Protected: ADMIN, MANAGER
   */
  @Post('announcements')
  async createAnnouncement(
    @Body() announcementData: { title: string; message: string },
    @CurrentUser() manager: any,
  ) {
    return await this.managerService.createAnnouncement(announcementData, manager);
  }

  /**
   * Resource Management - Manage team resources
   * Protected: ADMIN, MANAGER
   */
  @Get('resources')
  async getTeamResources(@CurrentUser() manager: any) {
    return await this.managerService.getTeamResources(manager);
  }
}
