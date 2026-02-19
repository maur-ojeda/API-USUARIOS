import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserAttributesService } from './user-attributes.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('user-attributes')
@Controller('user-attributes')
export class UserAttributesController {
  constructor(private readonly userAttributesService: UserAttributesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user attributes by user ID' })
  @ApiResponse({ status: 200, description: 'Returns user attributes' })
  @ApiResponse({ status: 404, description: 'User attributes not found' })
  async findOne(@Param('userId') userId: string) {
    return this.userAttributesService.findByUserId(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user attributes' })
  @ApiResponse({ status: 200, description: 'User attributes updated' })
  @ApiResponse({ status: 404, description: 'User attributes not found' })
  async update(@Param('userId') userId: string, @Body() updateData: any) {
    return this.userAttributesService.update(userId, updateData);
  }

  @Patch(':userId/custom-data')
  @ApiOperation({ summary: 'Update custom data (JSONB)' })
  @ApiResponse({ status: 200, description: 'Custom data updated' })
  @ApiResponse({ status: 404, description: 'User attributes not found' })
  async updateCustomData(
    @Param('userId') userId: string,
    @Body() customData: Record<string, any>,
  ) {
    return this.userAttributesService.updateCustomData(userId, customData);
  }

  @Patch(':userId/preferences')
  @ApiOperation({ summary: 'Update preferences (JSONB)' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  @ApiResponse({ status: 404, description: 'User attributes not found' })
  async updatePreferences(
    @Param('userId') userId: string,
    @Body() preferences: Record<string, any>,
  ) {
    return this.userAttributesService.updatePreferences(userId, preferences);
  }
}
