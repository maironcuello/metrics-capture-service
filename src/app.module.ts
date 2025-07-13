import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorCaptureModule } from './error-capture/error-capture.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import configuration from './common/config/configuration';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule.register({ global: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3311,
      username: 'myuser',
      password: 'mypassword',
      database: 'capture_metrics_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false
    }),
    ErrorCaptureModule,
    SubscriptionModule,
  ],
})
export class AppModule {}