import { Module } from '@nestjs/common';
import { ErrorCaptureService } from './error-capture.service';
import { ErrorCaptureController } from './error-capture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './error-log.entity';
import { ErrorCaptureGateway } from './error-capture.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog])],
  providers: [ErrorCaptureService, ErrorCaptureGateway],
  controllers: [ErrorCaptureController],
})
export class ErrorCaptureModule {}
