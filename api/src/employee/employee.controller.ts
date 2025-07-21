import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';
import { EmployeeService } from './employee.service';

@Controller('employee')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * Get employee dashboard - EMPLOYEE only
   */
  @Get('dashboard')
  @Roles(UserRole.EMPLOYEE)
  async getDashboard(@GetUser() user: any) {
    return this.employeeService.getDashboard(user);
  }

  /**
   * Get employee profile - EMPLOYEE only
   */
  @Get('profile')
  @Roles(UserRole.EMPLOYEE)
  async getProfile(@GetUser() user: any) {
    return this.employeeService.getProfile(user);
  }

  /**
   * Update employee profile - EMPLOYEE only
   */
  @Put('profile')
  @Roles(UserRole.EMPLOYEE)
  async updateProfile(
    @Body() profileData: { first_name?: string; last_name?: string },
    @GetUser() user: any,
  ) {
    return this.employeeService.updateProfile(profileData, user);
  }

  /**
   * Get employee schedule - EMPLOYEE only
   */
  @Get('schedule')
  @Roles(UserRole.EMPLOYEE)
  async getSchedule(@GetUser() user: any) {
    return this.employeeService.getSchedule(user);
  }

  /**
   * Get leave requests for the employee - EMPLOYEE only
   */
  @Get('leave-requests')
  @Roles(UserRole.EMPLOYEE)
  async getLeaveRequests(@GetUser() user: any) {
    return this.employeeService.getLeaveRequests(user);
  }

  /**
   * Submit a leave request - EMPLOYEE only
   */
  @Post('leave-requests')
  @Roles(UserRole.EMPLOYEE)
  async submitLeaveRequest(
    @Body()
    leaveData: {
      leaveType: string;
      startDate: string;
      endDate: string;
      reason: string;
    },
    @GetUser() user: any,
  ) {
    return this.employeeService.submitLeaveRequest(leaveData, user);
  }

  /**
   * Cancel a leave request - EMPLOYEE only
   */
  @Put('leave-requests/:id/cancel')
  @Roles(UserRole.EMPLOYEE)
  async cancelLeaveRequest(
    @Param('id', ParseIntPipe) requestId: number,
    @GetUser() user: any,
  ) {
    return this.employeeService.cancelLeaveRequest(requestId, user);
  }

  /**
   * Get employee tasks - EMPLOYEE only
   */
  @Get('tasks')
  @Roles(UserRole.EMPLOYEE)
  async getTasks(@GetUser() user: any) {
    return this.employeeService.getTasks(user);
  }

  /**
   * Update task status - EMPLOYEE only
   */
  @Put('tasks/:id/status')
  @Roles(UserRole.EMPLOYEE)
  async updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() statusData: { status: string; comments?: string },
    @GetUser() user: any,
  ) {
    return this.employeeService.updateTaskStatus(taskId, statusData, user);
  }

  /**
   * Get employee timesheet - EMPLOYEE only
   */
  @Get('timesheet')
  @Roles(UserRole.EMPLOYEE)
  async getTimesheet(@GetUser() user: any) {
    return this.employeeService.getTimesheet(user);
  }

  /**
   * Submit time entry - EMPLOYEE only
   */
  @Post('timesheet')
  @Roles(UserRole.EMPLOYEE)
  async submitTimeEntry(
    @Body()
    timeData: {
      date: string;
      startTime: string;
      endTime: string;
      breakTime?: number;
      description: string;
    },
    @GetUser() user: any,
  ) {
    return this.employeeService.submitTimeEntry(timeData, user);
  }

  /**
   * Get team announcements - EMPLOYEE only
   */
  @Get('announcements')
  @Roles(UserRole.EMPLOYEE)
  async getAnnouncements(@GetUser() user: any) {
    return this.employeeService.getAnnouncements(user);
  }

  /**
   * Mark announcement as read - EMPLOYEE only
   */
  @Put('announcements/:id/read')
  @Roles(UserRole.EMPLOYEE)
  async markAnnouncementRead(
    @Param('id', ParseIntPipe) announcementId: number,
    @GetUser() user: any,
  ) {
    return this.employeeService.markAnnouncementRead(announcementId, user);
  }

  /**
   * Get employee resources - EMPLOYEE only
   */
  @Get('resources')
  @Roles(UserRole.EMPLOYEE)
  async getResources(@GetUser() user: any) {
    return this.employeeService.getResources(user);
  }

  /**
   * Report an issue - EMPLOYEE only
   */
  @Post('issues')
  @Roles(UserRole.EMPLOYEE)
  async reportIssue(
    @Body()
    issueData: {
      title: string;
      description: string;
      priority: string;
      category: string;
    },
    @GetUser() user: any,
  ) {
    return this.employeeService.reportIssue(issueData, user);
  }

  /**
   * Get employee payslips - EMPLOYEE only
   */
  @Get('payslips')
  @Roles(UserRole.EMPLOYEE)
  async getPayslips(@GetUser() user: any) {
    return this.employeeService.getPayslips(user);
  }
}
