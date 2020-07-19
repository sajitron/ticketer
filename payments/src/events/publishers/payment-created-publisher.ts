import { Subjects, Publisher, PaymentCreatedEvent } from "@abtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}