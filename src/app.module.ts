import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'ormconfig';
import { IpEntity } from './ip/ip.entity';
import { IpModule } from './ip/ip.module';
import { IpValidationMiddleware } from './shared/middlewares/ip.middleware';
import { AuthModule } from './auth/auth.module';
import { ApiKeyEntity } from './auth/apiKey.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [IpEntity, ApiKeyEntity],
    }),
    IpModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpValidationMiddleware).forRoutes('ip/:ip');
  }
}
