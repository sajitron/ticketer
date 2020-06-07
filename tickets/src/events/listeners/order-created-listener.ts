import { Listener, OrderCreatedEvent, Subjects } from '@abtickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
queueGroupName;

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		// * find the ticket that the order is reserving
		const ticket = await Ticket.findById(data.ticket.id);
		// * if no ticket throw error
		if (!ticket) {
			throw new Error('Ticket not found');
		}
		// * mark the ticket as een reserved by setting order-id property
		ticket.set({ orderId: data.id });
		// * save the ticket
		await ticket.save();

		// * we can access the client property in the class bcos we set client as a protected property
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.version
		});
		// * ack the message
		msg.ack();
	}
}
