import { TicketUpdatedEvent } from '@abtickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
	// * create an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	// * create and save a ticket
	const ticket = await Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 67
	});
	await ticket.save();

	// * create a fake data object
	const data: TicketUpdatedEvent['data'] = {
		version: ticket.version + 1,
		id: ticket.id,
		title: 'sauti sol',
		price: 90,
		userId: 'fbahsdbda'
	};

	// * create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	};

	return { listener, data, msg, ticket };
};
it('finds, updates and saves a ticket', async () => {
	const { listener, ticket, msg, data } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
	const { listener, msg, data } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
	const { listener, msg, data } = await setup();

	data.version = 12;

	try {
		await listener.onMessage(data, msg);
	} catch (error) {}

	expect(msg.ack).not.toHaveBeenCalled();
});
