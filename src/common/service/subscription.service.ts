// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as http from 'http';
import * as https from 'https';

globalThis.httpsAgent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false, // Solo para desarrollo
});

globalThis.httpAgent = new http.Agent({
    keepAlive: true
})

@Injectable()
export class SubscriptionService {
    constructor(private readonly httpService: HttpService) { }

    async subscribeToServiceNow() {
        const webhookUrl = 'https://tu-instance.service-now.com/api/x_nuta_error_monitoring/create_incident';

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    webhookUrl,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + Buffer.from('usuario:password').toString('base64'),
                            'Upgrade': 'HTTP/2.0' // Especificar protocolo requerido
                        },
                        httpAgent: globalThis.httpAgent,
                        httpsAgent: globalThis.httpsAgent
                    }
                )
            );

            return response.data;
        } catch (error) {
            throw new Error(`Error en suscripción: ${error.message}`);
        }
    }
}