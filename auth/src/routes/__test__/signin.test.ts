import request from 'supertest';
import { app } from '../../app';

it('fails with a non-existent email', async () => {
	return request(app)
		.post('/api/users/signin')
		.send({
			email: 'alan@test.dev',
			password: 'password'
		})
		.expect(400);
});

it('fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'alan@test.dev',
			password: 'password'
		})
		.expect(201);

	return request(app)
		.post('/api/users/signin')
		.send({
			email: 'alan@test.dev',
			password: 'passwo'
		})
		.expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'alan@test.dev',
			password: 'password'
		})
		.expect(201);

	const response = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'alan@test.dev',
			password: 'password'
		})
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
