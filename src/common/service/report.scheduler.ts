import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ReportService } from './report.service';

@Injectable()
export class ReportScheduler {
    private readonly logger = new Logger(ReportScheduler.name);

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly reportService: ReportService,
    ) {
        this.scheduleWeeklyReport();
        this.scheduleBiWeeklyReport();
        this.scheduleMonthlyReport();
    }

    private scheduleWeeklyReport() {
        const job = new CronJob('0 0 * * 0', async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);

            const reportPath = await this.reportService.generateReport(startDate, endDate);
            this.logger.log(`Weekly report generated: ${reportPath}`);
        });

        this.schedulerRegistry.addCronJob('weeklyReport', job);
        job.start();
    }

    private scheduleBiWeeklyReport() {
        const job = new CronJob('0 0 1,15 * *', async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 15);

            const reportPath = await this.reportService.generateReport(startDate, endDate);
            this.logger.log(`Bi-weekly report generated: ${reportPath}`);
        });

        this.schedulerRegistry.addCronJob('biWeeklyReport', job);
        job.start();
    }

    private scheduleMonthlyReport() {
        const job = new CronJob('0 0 1 * *', async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 1);

            const reportPath = await this.reportService.generateReport(startDate, endDate);
            this.logger.log(`Monthly report generated: ${reportPath}`);
        });

        this.schedulerRegistry.addCronJob('monthlyReport', job);
        job.start();
    }
}