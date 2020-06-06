import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotAuthorizedError, NotFoundError, requireAuth } from '@abtickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').notEmpty().isString().withMessage('Valid title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('A valid price greater than 0 must be provided')
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		ticket.set({
			title: req.body.title,
			price: req.body.price
		});

		await ticket.save();

		res.send(ticket);
	}
);

export { router as updateTicketRouter };