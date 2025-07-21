import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get manager dashboard statistics
   */
  async getDashboardStats(manager: any) {
    const employees = await this.userRepository.count({ 
      where: { role: UserRole.EMPLOYEE } 
    });

    return {
      message: 'Manager dashboard stats',
      manager: {
        id: manager.id,
        email: manager.email,
        role: manager.role,
      },
      statistics: {
        totalEmployees: employees,
        pendingLeaveRequests: 5,
        approvedLeaveRequests: 12,
        teamPerformance: 87.5,
        upcomingDeadlines: 3,
      },
    };
  }

  /**
   * Get team members under management
   */
  async getTeamMembers(manager: any) {
    const employees = await this.userRepository.find({
      where: { role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at'],
    });

    return {
      message: 'Team members retrieved successfully',
      manager: manager.email,
      teamSize: employees.length,
      members: employees,
    };
  }

  /**
   * Get employees under management
   */
  async getEmployees(manager: any) {
    const employees = await this.userRepository.find({
      where: { role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'first_name', 'last_name', 'created_at'],
    });

    return {
      message: 'Employees retrieved successfully',
      manager: manager.email,
      totalEmployees: employees.length,
      employees: employees.map(emp => ({
        ...emp,
        status: 'Active',
        department: 'General',
        lastActivity: new Date().toISOString(),
      })),
    };
  }

  /**
   * Get leave requests for the team
   */
  async getLeaveRequests(manager: any) {
    // Mock leave request data - in real implementation, you'd have a leave request table
    return {
      message: 'Leave requests retrieved successfully',
      manager: manager.email,
      pendingRequests: [
        {
          id: 1,
          employeeId: 5,
          employeeName: 'John Employee',
          leaveType: 'Annual Leave',
          startDate: '2025-08-01',
          endDate: '2025-08-05',
          reason: 'Family vacation',
          status: 'Pending',
          submittedAt: '2025-07-20T10:00:00Z',
        },
        {
          id: 2,
          employeeId: 6,
          employeeName: 'Jane Worker',
          leaveType: 'Sick Leave',
          startDate: '2025-07-25',
          endDate: '2025-07-26',
          reason: 'Medical appointment',
          status: 'Pending',
          submittedAt: '2025-07-21T09:30:00Z',
        },
      ],
    };
  }

  /**
   * Approve or reject leave requests
   */
  async approveLeaveRequest(
    requestId: number,
    approvalData: { approved: boolean; comments?: string },
    manager: any,
  ) {
    const { approved, comments } = approvalData;

    return {
      message: `Leave request ${approved ? 'approved' : 'rejected'} successfully`,
      manager: manager.email,
      requestId,
      decision: approved ? 'Approved' : 'Rejected',
      comments: comments || 'No additional comments',
      processedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate department reports
   */
  async getDepartmentReports(manager: any) {
    return {
      message: 'Department reports generated successfully',
      manager: manager.email,
      reports: {
        attendance: {
          averageAttendance: '95.2%',
          lateArrivals: 3,
          earlyDepartures: 1,
        },
        productivity: {
          tasksCompleted: 127,
          averageTaskTime: '4.2 hours',
          efficiency: '92.8%',
        },
        leaveBalance: {
          totalLeavesTaken: 45,
          pendingRequests: 5,
          averageLeavePerEmployee: '8.5 days',
        },
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get employee performance data
   */
  async getEmployeePerformance(employeeId: number, manager: any) {
    const employee = await this.userRepository.findOne({
      where: { id: employeeId, role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'first_name', 'last_name'],
    });

    if (!employee) {
      return {
        message: 'Employee not found or not in your team',
        manager: manager.email,
        employeeId,
      };
    }

    return {
      message: 'Employee performance data retrieved',
      manager: manager.email,
      employee: {
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.email,
      },
      performance: {
        rating: 4.2,
        tasksCompleted: 23,
        punctuality: '96%',
        teamwork: 4.5,
        innovation: 4.0,
        lastReview: '2025-06-15',
        goals: [
          'Improve project documentation',
          'Lead junior team member mentoring',
          'Complete certification program',
        ],
      },
    };
  }

  /**
   * Get team schedules
   */
  async getTeamSchedules(manager: any) {
    return {
      message: 'Team schedules retrieved successfully',
      manager: manager.email,
      schedules: [
        {
          employeeId: 5,
          employeeName: 'John Employee',
          schedule: {
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: '9:00 AM - 5:00 PM',
          },
          status: 'Active',
        },
        {
          employeeId: 6,
          employeeName: 'Jane Worker',
          schedule: {
            monday: '8:00 AM - 4:00 PM',
            tuesday: '8:00 AM - 4:00 PM',
            wednesday: '8:00 AM - 4:00 PM',
            thursday: '8:00 AM - 4:00 PM',
            friday: '8:00 AM - 4:00 PM',
          },
          status: 'On Leave',
        },
      ],
    };
  }

  /**
   * Create team announcement
   */
  async createAnnouncement(
    announcementData: { title: string; message: string },
    manager: any,
  ) {
    const { title, message } = announcementData;

    return {
      message: 'Announcement created successfully',
      manager: manager.email,
      announcement: {
        id: Math.floor(Math.random() * 1000),
        title,
        message,
        createdBy: manager.email,
        createdAt: new Date().toISOString(),
        targetAudience: 'Team Members',
        status: 'Published',
      },
    };
  }

  /**
   * Get team resources
   */
  async getTeamResources(manager: any) {
    return {
      message: 'Team resources retrieved successfully',
      manager: manager.email,
      resources: {
        equipment: [
          { id: 1, type: 'Laptop', assigned: 'John Employee', status: 'Active' },
          { id: 2, type: 'Monitor', assigned: 'Jane Worker', status: 'Active' },
        ],
        software: [
          { name: 'Project Management Tool', licenses: 10, used: 8 },
          { name: 'Design Software', licenses: 5, used: 3 },
        ],
        budget: {
          allocated: 50000,
          spent: 32500,
          remaining: 17500,
          utilization: '65%',
        },
      },
    };
  }
}
