import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiResponse({ status: 200, description: 'Returns user addresses' })
  async findByUserId(@Param('userId') userId: string) {
    return this.addressesService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by id' })
  @ApiResponse({ status: 200, description: 'Returns the address' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @Post('user/:userId')
  @ApiOperation({ summary: 'Create address for user' })
  @ApiResponse({ status: 201, description: 'Address created' })
  async create(@Param('userId') userId: string, @Body() createData: any) {
    return this.addressesService.create(userId, createData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.addressesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
