import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get employee dashboard
   */
  async getDashboard(employee: any) {
    return {
      message: 'Employee dashboard data',
      employee: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
      },
      summary: {
        pendingTasks: 5,
        completedTasksThisWeek: 12,
        upcomingDeadlines: 2,
        leaveBalance: 15,
        lastLoginTime: new Date().toISOString(),
      },
      notifications: [
        'Your leave request has been approved',
        'New task assigned: Update project documentation',
        'Team meeting scheduled for tomorrow at 2 PM',
      ],
    };
  }

  /**
   * Get employee profile
   */
  async getProfile(employee: any) {
    const userProfile = await this.userRepository.findOne({
      where: { id: employee.id },
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'created_at'],
    });

    if (!userProfile) {
      return { message: 'Profile not found' };
    }

    return {
      message: 'Profile retrieved successfully',
      profile: {
        ...userProfile,
        department: 'General',
        position: 'Team Member',
        manager: 'manager@company.com',
        startDate: userProfile.created_at,
        phoneNumber: '+1234567890',
        address: '123 Main St, City, State',
      },
    };
  }

  /**
   * Update employee profile
   */
  async updateProfile(
    profileData: { first_name?: string; last_name?: string },
    employee: any,
  ) {
    const { first_name, last_name } = profileData;

    await this.userRepository.update(employee.id, {
      ...(first_name && { first_name }),
      ...(last_name && { last_name }),
    });

    return {
      message: 'Profile updated successfully',
      employee: employee.email,
      updatedFields: { first_name, last_name },
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get employee schedule
   */
  async getSchedule(employee: any) {
    return {
      message: 'Schedule retrieved successfully',
      employee: employee.email,
      currentWeek: {
        monday: { start: '9:00 AM', end: '5:00 PM', status: 'Scheduled' },
        tuesday: { start: '9:00 AM', end: '5:00 PM', status: 'Scheduled' },
        wednesday: { start: '9:00 AM', end: '5:00 PM', status: 'Scheduled' },
        thursday: { start: '9:00 AM', end: '5:00 PM', status: 'Scheduled' },
        friday: { start: '9:00 AM', end: '5:00 PM', status: 'Scheduled' },
      },
      upcomingChanges: [],
      totalHoursThisWeek: 40,
    };
  }

  /**
   * Get employee leave requests
   */
  async getLeaveRequests(employee: any) {
    // Mock leave request data - in real implementation, you'd have a leave request table
    return {
      message: 'Leave requests retrieved successfully',
      employee: employee.email,
      totalRequests: 3,
      requests: [
        {
          id: 1,
          type: 'Annual Leave',
          startDate: '2025-08-01',
          endDate: '2025-08-05',
          days: 5,
          status: 'Approved',
          reason: 'Family vacation',
          submittedAt: '2025-07-20T10:00:00Z',
          reviewedBy: 'manager@company.com',
        },
        {
          id: 2,
          type: 'Sick Leave',
          startDate: '2025-07-15',
          endDate: '2025-07-16',
          days: 2,
          status: 'Approved',
          reason: 'Medical appointment',
          submittedAt: '2025-07-10T09:00:00Z',
          reviewedBy: 'manager@company.com',
        },
        {
          id: 3,
          type: 'Personal Leave',
          startDate: '2025-09-10',
          endDate: '2025-09-10',
          days: 1,
          status: 'Pending',
          reason: 'Personal matters',
          submittedAt: '2025-07-22T14:30:00Z',
        },
      ],
    };
  }

  /**
   * Submit leave request
   */
  async submitLeaveRequest(
    leaveData: {
      leaveType: string;
      startDate: string;
      endDate: string;
      reason: string;
    },
    employee: any,
  ) {
    const { leaveType, startDate, endDate, reason } = leaveData;

    return {
      message: 'Leave request submitted successfully',
      employee: employee.email,
      request: {
        id: Math.floor(Math.random() * 1000),
        type: leaveType,
        startDate,
        endDate,
        reason,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Cancel leave request
   */
  async cancelLeaveRequest(requestId: number, employee: any) {
    return {
      message: 'Leave request cancelled successfully',
      employee: employee.email,
      requestId,
      cancelledAt: new Date().toISOString(),
    };
  }

  /**
   * Get employee tasks
   */
  async getTasks(employee: any) {
    return {
      message: 'Tasks retrieved successfully',
      employee: employee.email,
      tasks: [
        {
          id: 1,
          title: 'Complete project documentation',
          description: 'Update all project documentation for Q3',
          priority: 'High',
          status: 'In Progress',
          dueDate: '2025-08-01',
          assignedBy: 'manager@company.com',
          progress: 75,
        },
        {
          id: 2,
          title: 'Review team proposals',
          description: 'Review and provide feedback on team project proposals',
          priority: 'Medium',
          status: 'Pending',
          dueDate: '2025-07-30',
          assignedBy: 'manager@company.com',
          progress: 0,
        },
        {
          id: 3,
          title: 'Attend training session',
          description: 'Mandatory security training session',
          priority: 'Medium',
          status: 'Completed',
          dueDate: '2025-07-20',
          assignedBy: 'hr@company.com',
          progress: 100,
        },
      ],
    };
  }

  /**
   * Update task status
   */
  async updateTaskStatus(
    taskId: number,
    statusData: { status: string; comments?: string },
    employee: any,
  ) {
    const { status, comments } = statusData;

    return {
      message: 'Task status updated successfully',
      employee: employee.email,
      task: {
        id: taskId,
        status,
        comments: comments || 'No additional comments',
        updatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Get employee timesheet
   */
  async getTimesheet(employee: any) {
    return {
      message: 'Timesheet retrieved successfully',
      employee: employee.email,
      currentWeek: {
        totalHours: 38.5,
        regularHours: 38.5,
        overtimeHours: 0,
        entries: [
          {
            date: '2025-07-21',
            startTime: '9:00 AM',
            endTime: '5:00 PM',
            breakTime: 60,
            totalHours: 7,
            description: 'Regular work day',
          },
          {
            date: '2025-07-22',
            startTime: '9:00 AM',
            endTime: '4:30 PM',
            breakTime: 30,
            totalHours: 7,
            description: 'Early leave for appointment',
          },
        ],
      },
    };
  }

  /**
   * Submit time entry
   */
  async submitTimeEntry(
    timeData: {
      date: string;
      startTime: string;
      endTime: string;
      breakTime?: number;
      description: string;
    },
    employee: any,
  ) {
    const { date, startTime, endTime, breakTime, description } = timeData;

    return {
      message: 'Time entry submitted successfully',
      employee: employee.email,
      entry: {
        id: Math.floor(Math.random() * 1000),
        date,
        startTime,
        endTime,
        breakTime: breakTime || 0,
        description,
        submittedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Get team announcements
   */
  async getAnnouncements(employee: any) {
    return {
      message: 'Announcements retrieved successfully',
      employee: employee.email,
      announcements: [
        {
          id: 1,
          title: 'Office Renovation Update',
          message: 'The office renovation will begin next Monday. Please plan accordingly.',
          createdBy: 'manager@company.com',
          createdAt: '2025-07-22T09:00:00Z',
          priority: 'High',
          read: false,
        },
        {
          id: 2,
          title: 'Team Building Event',
          message: 'Join us for a team building event this Friday at 4 PM.',
          createdBy: 'hr@company.com',
          createdAt: '2025-07-20T14:30:00Z',
          priority: 'Medium',
          read: true,
        },
      ],
    };
  }

  /**
   * Mark announcement as read
   */
  async markAnnouncementRead(announcementId: number, employee: any) {
    return {
      message: 'Announcement marked as read',
      employee: employee.email,
      announcementId,
      readAt: new Date().toISOString(),
    };
  }

  /**
   * Get employee resources
   */
  async getResources(employee: any) {
    return {
      message: 'Resources retrieved successfully',
      employee: employee.email,
      resources: {
        assignedEquipment: [
          { id: 1, type: 'Laptop', model: 'MacBook Pro', serialNumber: 'MBP12345' },
          { id: 2, type: 'Monitor', model: '27" Display', serialNumber: 'MON67890' },
        ],
        softwareAccess: [
          { name: 'Project Management Tool', accessLevel: 'User', expiresAt: '2025-12-31' },
          { name: 'Email Client', accessLevel: 'Full', expiresAt: 'Permanent' },
        ],
        documents: [
          { name: 'Employee Handbook', url: '/documents/handbook.pdf' },
          { name: 'Safety Guidelines', url: '/documents/safety.pdf' },
        ],
      },
    };
  }

  /**
   * Report an issue
   */
  async reportIssue(
    issueData: {
      title: string;
      description: string;
      priority: string;
      category: string;
    },
    employee: any,
  ) {
    const { title, description, priority, category } = issueData;

    return {
      message: 'Issue reported successfully',
      employee: employee.email,
      issue: {
        id: Math.floor(Math.random() * 1000),
        title,
        description,
        priority,
        category,
        status: 'Open',
        reportedAt: new Date().toISOString(),
        assignedTo: 'support@company.com',
      },
    };
  }

  /**
   * Get employee payslips
   */
  async getPayslips(employee: any) {
    return {
      message: 'Payslips retrieved successfully',
      employee: employee.email,
      payslips: [
        {
          id: 1,
          period: '2025-07',
          grossPay: 5000,
          deductions: 1200,
          netPay: 3800,
          generatedAt: '2025-07-31T23:59:59Z',
          downloadUrl: '/payslips/2025-07.pdf',
        },
        {
          id: 2,
          period: '2025-06',
          grossPay: 5000,
          deductions: 1200,
          netPay: 3800,
          generatedAt: '2025-06-30T23:59:59Z',
          downloadUrl: '/payslips/2025-06.pdf',
        },
      ],
    };
  }
}
