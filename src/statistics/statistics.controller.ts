import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) { }

    @Get('dashboard')
    async getDashboardStatistics() {
        return await this.statisticsService.getDashboardStatistics();
    }

    @Get('earnings-report')
    async getEarningsReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return await this.statisticsService.getEarningsReport(start, end);
    }

    @Get('enrollment-report')
    async getEnrollmentReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return await this.statisticsService.getEnrollmentReport(start, end);
    }
}
