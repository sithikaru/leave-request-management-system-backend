import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { UserRole } from '../src/entities/user.entity';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Check if admin user already exists
    const existingAdmin = await userService.findByEmail('admin@lrms.com');
    if (existingAdmin) {
      console.log('Admin user already exists');
      await app.close();
      return;
    }

    // Create admin user
    const adminUser = await userService.create({
      email: 'admin@lrms.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      role: UserRole.EMPLOYEE // This will be updated below
    });

    // Update role to ADMIN
    await userService.updateUserRole(
      { userId: adminUser.id, role: UserRole.ADMIN },
      { id: adminUser.id, role: UserRole.ADMIN }
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@lrms.com');
    console.log('Password: admin123');
    console.log('Name: Admin User');
    console.log('Role: ADMIN');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await app.close();
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser().catch(console.error);
}

export { createAdminUser };
