import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY secret is required');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI secret is required');
	}

	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID secret is required');
	}

	if (!process.env.NATS_URL) {
		throw new Error('NATS_URL secret is required');
	}

	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID secret is required');
	}

	try {
		await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed');
			process.exit();
		});
		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('MongoDB connected 🏂 tickets!');
	} catch (error) {
		console.error(error);
	}

	const port = 8000;

	app.listen(port, () => console.log('App listening on 🚀🚀' + port));
};

start();
