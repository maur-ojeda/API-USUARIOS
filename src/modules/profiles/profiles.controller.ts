import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiResponse({ status: 200, description: 'Returns the profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findOne(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async update(@Param('userId') userId: string, @Body() updateData: any) {
    return this.profilesService.update(userId, updateData);
  }
}
