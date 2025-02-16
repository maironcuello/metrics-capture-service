import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from './error-log.entity';
import { MAX_ERROR_MESSAGE_LENGTH, MAX_STACK_TRACE_LENGTH } from './constants';
import { ErrorCaptureGateway } from './error-capture.gateway';

@Injectable()
export class ErrorCaptureService {
    constructor(
        @InjectRepository(ErrorLog)
        private errorLogRepository: Repository<ErrorLog>,
        private errorCaptureGateway: ErrorCaptureGateway,
    ) { }



    private truncateText(text: string, maxLength: number): string {
        if (text.length > maxLength) {
            return text.substring(0, maxLength);
        }
        return text;
    }

    async captureError(errorLog: ErrorLog) {

        errorLog.errorMessage = this.truncateText(errorLog.errorMessage, MAX_ERROR_MESSAGE_LENGTH);
        errorLog.stackTrace = this.truncateText(errorLog.stackTrace || '', MAX_STACK_TRACE_LENGTH);
        await this.errorLogRepository.save(errorLog);
        this.errorCaptureGateway.broadcastError(errorLog);
    }

    async getErrors(): Promise<ErrorLog[]> {
        return this.errorLogRepository.find();
    }

    async getErrorByName(name: string): Promise<ErrorLog[]> {
        return this.errorLogRepository.find({ where: { serviceName: name } });
    }
}