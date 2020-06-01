import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY secret is required');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI secret is required');
	}

	try {
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
