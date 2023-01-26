import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../shared/guards/apiKey.guard';
import { Ip } from './ip.interface';
import { IpService } from './ip.service';

@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('apiKey')
  @ApiOperation({ summary: 'Lookup IP information', tags: ['IP'] })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 400, description: 'Invalid IP address' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get(':ip')
  async lookupIp(@Param('ip') ip: string): Promise<Ip> {
    return await this.ipService.lookupIp(ip);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('apiKey')
  @ApiOperation({ summary: 'Remove IP from database', tags: ['IP'] })
  @ApiResponse({ status: 400, description: 'Invalid IP address' })
  @ApiResponse({ status: 204, description: 'Successful operation' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Delete(':ip')
  @HttpCode(204)
  async removeIp(@Param('ip') ip: string): Promise<void> {
    await this.ipService.removeIp(ip);
  }
}
