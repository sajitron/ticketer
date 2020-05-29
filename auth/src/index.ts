import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY secret is required');
	}
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('MongoDB connected!');
	} catch (error) {
		console.error(error);
	}

	const port = 8000;

	app.listen(port, () => console.log('App listening on 🚀🚀' + port));
};

start();
