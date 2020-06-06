import { Publisher, OrderCreatedEvent, Subjects } from '@abtickets/common';

export class OrderCreatedPubisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
