import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get user by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Post('users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created' })
  async createUser(
    @Body()
    data: {
      email: string;
      password: string;
      roleId: number;
      firstName?: string;
      lastName?: string;
    },
  ) {
    return this.adminService.createUser(data);
  }

  @Patch('users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Delete('users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/restore')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Restore deleted user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User restored' })
  async restoreUser(@Param('id') id: string) {
    return this.adminService.restoreUser(id);
  }

  @Patch('users/:id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Change user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated' })
  async updateUserRole(
    @Param('id') id: string,
    @Body('roleId') roleId: number,
  ) {
    return this.adminService.updateUserRole(id, roleId);
  }

  @Get('roles')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all roles' })
  async getRoles() {
    return this.adminService.getRoles();
  }
}
