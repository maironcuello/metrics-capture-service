// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) { }

    async subscribe(subscriptionData: Partial<Subscription>) {
        return this.subscriptionRepository.save(subscriptionData);
    }

    async notifySubscribers(errorData: any) {
        const subscriptions = await this.subscriptionRepository.find({
            where: { isActive: true }
        });

        for (const sub of subscriptions) {
            try {
                await axios.post(sub.webhookUrl, errorData, {
                    headers: {
                        'Authorization': `Bearer ${sub.authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error(`Error notifying ${sub.webhookUrl}:`, error.message);
            }
        }
    }
}