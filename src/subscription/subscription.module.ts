import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from 'src/error-capture';
import { Subscription } from './entities';
import { SubscriptionController } from './subscription.controller';

@Module({
    imports: [ TypeOrmModule.forFeature([Subscription]) ],
    controllers: [SubscriptionController],
    providers: [ SubscriptionService ],
    exports: [ SubscriptionService ]
})
export class SubscriptionModule {}
