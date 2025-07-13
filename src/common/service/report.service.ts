import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorLog } from 'src/error-capture';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ErrorLog)
        private readonly errorLogRepository: Repository<ErrorLog>,
    ) { }

    async generateReport(startDate: Date, endDate: Date): Promise<string> {
        const errors = await this.errorLogRepository
            .createQueryBuilder('errorLog')
            .where('errorLog.lastOccurrence BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            })
            .getMany();

        const reportContent = this.formatReport(errors, startDate, endDate);
        const reportFileName = `error_report_${startDate.toISOString()}_${endDate.toISOString()}.txt`;
        const reportPath = path.join(__dirname, '..', 'reports', reportFileName);

        // Guardar el informe en un archivo
        fs.writeFileSync(reportPath, reportContent);

        return reportPath;
    }

    private formatReport(errors: ErrorLog[], startDate: Date, endDate: Date): string {
        let report = `Error Report (${startDate.toISOString()} - ${endDate.toISOString()})\n\n`;
        report += `Total Errors: ${errors.length}\n\n`;

        errors.forEach((error) => {
            report += `Service: ${error.serviceName}\n`;
            report += `Message: ${error.errorMessage}\n`;
            report += `Count: ${error.count}\n`;
            report += `First Occurrence: ${error.firstOccurrence}\n`;
            report += `Last Occurrence: ${error.lastOccurrence}\n`;
            report += '----------------------------------------\n';
        });

        return report;
    }
}