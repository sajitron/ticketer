import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characterss')
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email in Use');
		}

		const user = User.build({ email, password });
		await user.save();

		// generate jwt
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email
			},
			process.env.JWT_KEY!
		);

		// store on session object
		// @ts-ignore: Unreachable code error
		req.session = {
			jwt: userJwt
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
