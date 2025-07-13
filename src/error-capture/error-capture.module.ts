import { Module } from '@nestjs/common';
import { ErrorCaptureService } from './error-capture.service';
import { ErrorCaptureController } from './error-capture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './entities/error-log.entity';
import { ErrorCaptureGateway } from './error-capture.gateway';
import { ReportScheduler, ReportService } from 'src/common/service';
import { ScheduleModule } from '@nestjs/schedule';
import { Subscription, SubscriptionModule, SubscriptionService } from 'src/subscription';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorLog, Subscription]),
    ScheduleModule.forRoot({}),
    SubscriptionModule,
  ],
  providers: [
    ErrorCaptureService,
    SubscriptionService,
    // ErrorCaptureGateway, 
    ReportService, 
    ReportScheduler
  ],
  controllers: [ErrorCaptureController],
})
export class ErrorCaptureModule {}
