import { Ticket } from '../Ticket';

it('implements optimistic concurrency control', async (done) => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 67,
		userId: '2345'
	});
	// * save the ticket to the database
	await ticket.save();

	// * fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// * make two separate changes to the tickets we fetched
	firstInstance!.set({ price: 100 });
	secondInstance!.set({ price: 120 });

	// * save the first fetched ticket
	await firstInstance!.save();

	// * save the second fetched ticket
	try {
		await secondInstance!.save();
	} catch (error) {
		return done();
	}

	throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 67,
		userId: '2345'
	});
	await ticket.save();
	expect(ticket.version).toEqual(0);
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
