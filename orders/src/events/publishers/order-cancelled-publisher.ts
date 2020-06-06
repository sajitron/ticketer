import { Publisher, OrderCancelledEvent, Subjects } from '@abtickets/common';

export class OrderCancelledPubisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
