// error.service.ts
import { Injectable } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ErrorService {
    httpService: any;
    constructor(private subscriptionService: SubscriptionService) { }

    async notifyServiceNow(errorData: any) {
        const payload = {
            serviceName: errorData.service,
            errorMessage: errorData.message.substring(0, 100), // ServiceNow limita a 160 chars
            stackTrace: errorData.stack,
            severity: errorData.level || 'medium'
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    'https://tu-instance.service-now.com/api/x_nuta_error_monitoring/create_incident',
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + Buffer.from('usuario:password').toString('base64'),
                            'Connection': 'Upgrade',
                            'Upgrade': 'HTTP/2.0'
                        }
                    }
                )
            ) as { data: any };

            return response.data;
        } catch (error) {
            console.error('Error al notificar ServiceNow:', error.response?.data || error.message);
            throw error;
        }
    }
}