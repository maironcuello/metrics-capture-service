import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from 'src/error-capture';
import { Subscription } from './entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription]),
    ],
    providers: [
        SubscriptionService,
    ],
    exports: [
        SubscriptionService,
    ]
})
export class SubscriptionModule {}
