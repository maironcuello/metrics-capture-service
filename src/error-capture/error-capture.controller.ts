import { Controller, Post, Body, Get } from '@nestjs/common';
import { ErrorCaptureService } from './error-capture.service';
import { ErrorLog } from './entities/error-log.entity';

@Controller('api/error-capture')
export class ErrorCaptureController {
    constructor(private readonly errorCaptureService: ErrorCaptureService) { }

    @Post('capture')
    async captureError(@Body() dto: Partial<ErrorLog>) {
        await this.errorCaptureService.captureErrorHash(dto);
    }

    @Get('errors')
    async getErrors() {
        return this.errorCaptureService.getErrors();
    }

    @Get('errors/:name')
    async getErrorByName(name: string) {
        return this.errorCaptureService.getErrorByName(name);
    }

    @Get('trends')
    async getErrorTrends() {
        return this.errorCaptureService.getErrorTrends();
    }

    
}