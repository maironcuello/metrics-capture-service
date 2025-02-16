import { Controller, Post, Body, Get } from '@nestjs/common';
import { ErrorCaptureService } from './error-capture.service';
import { ErrorLog } from './error-log.entity';

@Controller('api/error-capture')
export class ErrorCaptureController {
    constructor(private readonly errorCaptureService: ErrorCaptureService) { }

    @Post('capture')
    async captureError(@Body() errorLog: ErrorLog) {
        console.log(errorLog.serviceName, errorLog.errorMessage);
        await this.errorCaptureService.captureError(errorLog);
    }

    @Get('errors')
    async getErrors() {
        return this.errorCaptureService.getErrors();
    }

    @Get('errors/:name')
    async getErrorByName(name: string) {
        return this.errorCaptureService.getErrorByName(name);
    }
}