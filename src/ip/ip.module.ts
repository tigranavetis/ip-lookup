import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ApiKeyGuard } from 'src/shared/guards/apiKey.guard';

import { IpController } from './ip.controller';
import { IpEntity } from './ip.entity';
import { IpService } from './ip.service';

@Module({
  imports: [TypeOrmModule.forFeature([IpEntity]), AuthModule],
  controllers: [IpController],
  providers: [IpService, ApiKeyGuard, ConfigService],
  exports: [IpService],
})
export class IpModule {}
