import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({ title: 'bla bla', price: 56 })
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	await request(app).put(`/api/tickets/${id}`).send({ title: 'bla bla', price: 56 }).expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'scroo', price: 67 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({ title: 'bla bla', price: 56 })
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'scroo', price: 67 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 34, price: 34 })
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'Bastille', price: 'text' })
		.expect(400);
});

it('updates the ticket if a valid input is passed', async () => {
	const cookie = global.signin();

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'scroo', price: 67 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'new title', price: 98 })
		.expect(200);

	const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

	expect(ticketResponse.body.title).toEqual('new title');
});

it('publishes an event', async () => {
	const cookie = global.signin();

	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({ title: 'scroo', price: 67 });

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({ title: 'new title', price: 98 })
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
