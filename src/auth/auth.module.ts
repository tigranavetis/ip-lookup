import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyEntity } from './apiKey.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
