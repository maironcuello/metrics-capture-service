// src/subscription/subscription.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Post()
    create(@Body() subscription: Partial<Subscription>) {
        return this.subscriptionService.create(subscription);
    }

    @Get()
    findAll() {
        return this.subscriptionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subscriptionService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() subscription: Partial<Subscription>) {
        return this.subscriptionService.update(+id, subscription);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subscriptionService.remove(+id);
    }
}