import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
		}
	}
}

// * jest imports the mock file rather than the file we are pointing to below
jest.mock('../nats-wrapper.ts');

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'asgardian';
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = () => {
	// build a jwt payload. {id, email}
	const id = mongoose.Types.ObjectId().toHexString();

	const payload = {
		id,
		email: 'test@test.com'
	};

	// create a jwt
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// build session object
	const session = { jwt: token };

	// turn session into json
	const sessionJSON = JSON.stringify(session);

	// take session and encode as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// return a string which is a data--encoded cookie
	return [ `express:sess=${base64}` ];
};

jest.setTimeout(30000);
