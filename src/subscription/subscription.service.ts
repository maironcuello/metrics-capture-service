import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        private httpService: HttpService,
    ) { }

    async create(subscription: Partial<Subscription>): Promise<Subscription> {
        // Generar clave secreta si no se proporciona
        if (!subscription.secretKey) {
            subscription.secretKey = crypto.randomBytes(32).toString('hex');
        }
        return this.subscriptionRepository.save(subscription);
    }

    async findAll(): Promise<Subscription[]> {
        return this.subscriptionRepository.find();
    }

    async findActive(): Promise<Subscription[]> {
        return this.subscriptionRepository.find({ where: { isActive: true } });
    }

    async findOne(id: number): Promise<Subscription> {
        return this.subscriptionRepository.findOne({ where: { id }});
    }

    async update(id: number, subscription: Partial<Subscription>): Promise<Subscription> {
        await this.subscriptionRepository.update(id, subscription);
        return this.subscriptionRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.subscriptionRepository.delete(id);
    }

    async notifySubscribers(event: string, data: any) {
        const subscriptions = await this.findActive();
        const eventSubscriptions = subscriptions.filter(sub => sub.events.includes(event));

        for (const sub of eventSubscriptions) {
            try {
                await this.deliverNotification(sub, data);
                // Resetear contador de reintentos si fue exitoso
                if (sub.retryCount > 0) {
                    await this.update(sub.id, { retryCount: 0, lastError: null });
                }
            } catch (error) {
                // Manejar errores y reintentos
                await this.handleDeliveryError(sub, error);
            }
        }
    }

    private async deliverNotification(subscription: Subscription, data: any) {
        const payload = JSON.stringify(data);
        const signature = this.createSignature(payload, subscription.secretKey);

        await firstValueFrom(
            this.httpService.post(subscription.targetUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Signature': signature,
                    'X-Event-Type': 'error',
                    'User-Agent': 'ErrorMetricsWebhookNotifier/1.0',
                },
                timeout: 10000, // 10 segundos de timeout
            })
        );
    }

    private createSignature(payload: string, secret: string): string {
        return crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');
    }

    private async handleDeliveryError(subscription: Subscription, error: any) {
        const errorMessage = error.response?.data?.message || error.message;
        const retryCount = subscription.retryCount + 1;

        // Desactivar después de 5 intentos fallidos
        const isActive = retryCount <= 5;

        await this.update(subscription.id, {
            retryCount,
            lastError: errorMessage.substring(0, 255), // Limitar tamaño
            isActive
        });

        // Opcional: Notificar a un canal de alertas sobre el fallo
        if (!isActive) {
            this.notifySubscriptionFailure(subscription);
        }
    }

    private notifySubscriptionFailure(subscription: Subscription) {
        // Implementar lógica para notificar a un canal de alertas
        console.error(`Suscripción desactivada: ${subscription.name} - ${subscription.targetUrl}`);
    }
}