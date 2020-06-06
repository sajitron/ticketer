import { Publisher, Subjects, TicketUpdatedEvent } from '@abtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
