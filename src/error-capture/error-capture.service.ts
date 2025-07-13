import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from './entities/error-log.entity';
import { MAX_ERROR_MESSAGE_LENGTH, MAX_STACK_TRACE_LENGTH } from './constants';
import { ErrorCaptureGateway } from './error-capture.gateway';
import * as crypto from 'crypto';

@Injectable()
export class ErrorCaptureService {
    constructor(
        @InjectRepository(ErrorLog)
        private errorLogRepository: Repository<ErrorLog>,
        private errorCaptureGateway: ErrorCaptureGateway,
    ) { }

    private generateErrorHash(error: Partial<ErrorLog>): string {
        const hash = crypto.createHash('sha256');
        hash.update(error.errorMessage + error.stackTrace);
        return hash.digest('hex');
    }

    private truncateText(text: string, maxLength: number): string {
        if (text.length > maxLength) {
            return text.substring(0, maxLength);
        }
        return text;
    }

    async captureErrorHash(error: Partial<ErrorLog>) {
        const errorHash = this.generateErrorHash(error);
        const existingError = await this.errorLogRepository.findOne({ where: { errorHash } });

        if (existingError) {
            existingError.count += 1;
            existingError.lastOccurrence = new Date();
            await this.errorLogRepository.save(existingError);
        } else {
            const newError = this.errorLogRepository.create({
                ...error,
                errorHash,
                count: 1,
                firstOccurrence: new Date(),
                lastOccurrence: new Date(),
            });
            await this.errorLogRepository.save(newError);
        }
    }

    async captureError(errorLog: Partial<ErrorLog>) {

        errorLog.errorMessage = this.truncateText(errorLog.errorMessage, MAX_ERROR_MESSAGE_LENGTH);
        errorLog.stackTrace = this.truncateText(errorLog.stackTrace || '', MAX_STACK_TRACE_LENGTH);
        await this.errorLogRepository.save(errorLog);
        this.errorCaptureGateway.broadcastError(errorLog);

    }

    async getErrorTrends(): Promise<any> {
        return this.errorLogRepository
            .createQueryBuilder('errorLog')
            .select('errorLog.serviceName', 'serviceName')
            .addSelect('SUM(errorLog.count)', 'totalErrors')
            .addSelect('MAX(errorLog.lastOccurrence)', 'lastOccurrence')
            .groupBy('errorLog.serviceName')
            .orderBy('totalErrors', 'DESC')
            .getRawMany();
    }

    async getErrors(): Promise<ErrorLog[]> {
        return this.errorLogRepository.find();
    }

    async getErrorByName(name: string): Promise<ErrorLog[]> {
        return this.errorLogRepository.find({ where: { serviceName: name } });
    }
}