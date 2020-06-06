import { Publisher, Subjects, TicketCreatedEvent } from '@abtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
