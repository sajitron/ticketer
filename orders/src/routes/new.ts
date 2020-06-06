import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@abtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
	'/api/orders',
	requireAuth,
	body('ticketId')
		.notEmpty()
		.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
		.withMessage('TicketId must be supplied'),
	validateRequest,
	async (req: Request, res: Response) => {
		// * find the ticket the user is trying to order in the DB
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		// * make sure the ticket is not already reserved
		const isReserved = await ticket.isReserved();

		if (isReserved) {
			throw new BadRequestError('Ticket is already reserved');
		}

		// * calculate an expiry date for order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// * build the order & save to DB
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket
		});

		await order.save();

		// * emit order created event

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
