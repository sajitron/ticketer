import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {OrderStatus, ExpirationCompleteEvent} from '@abtickets/common';
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/Order";
import { Ticket } from "../../../models/Ticket";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'coldplay tour',
        price: 45
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'dhjbdajba',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
	const msg: Message = {
		ack: jest.fn()
    };
    
    return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
    const { listener, data, order, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
    const { listener, data, order, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    // * first arg is subject, second is the data
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled()
});