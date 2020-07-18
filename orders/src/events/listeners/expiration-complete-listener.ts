import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from '@abtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';
import { OrderCancelledPubisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        // * do not cancel completed orders
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        } 

        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();
        await new OrderCancelledPubisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            }
        });

        msg.ack()
    }
}