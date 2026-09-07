import type { ConversationVariant } from './widgets'

/**
 * Content for the /shared-language page: the same small change discussed
 * without and with C4 vocabulary, plus the eight words the talk leans on.
 */
export const conversations: ConversationVariant[] = [
  {
    id: 'before',
    title: 'Without a shared language',
    lines: [
      {
        who: 'Product owner',
        text: 'Small one: when an order ships, the customer gets an email. Can we do that this sprint?',
      },
      {
        who: 'Junior dev',
        text: 'Sure. I can add it in the backend, where the order status changes.',
      },
      {
        who: 'Dev',
        text: 'Which backend? Shipping status comes from the warehouse, that is not our code.',
      },
      {
        who: 'Senior dev',
        text: 'There is a queue for that. We put something on a queue when the warehouse is done.',
      },
      {
        who: 'Dev',
        text: 'That is the nightly export. Or do you mean the thing that talks to the carrier?',
      },
      {
        who: 'Ops',
        text: 'Whatever sends mail has to go through the mail gateway, and that is another team.',
      },
      {
        who: 'Product owner',
        text: 'So is this small or not?',
      },
      {
        who: 'Senior dev',
        text: 'Let’s get the warehouse team in a room and figure out where this lives.',
      },
    ],
    outcome: 'A meeting is planned for next week',
    minutesToDecision: 4320,
  },
  {
    id: 'after',
    title: 'With C4 vocabulary',
    lines: [
      {
        who: 'Product owner',
        text: 'When an order ships, the customer gets an email. Can we do that this sprint?',
      },
      {
        who: 'Junior dev',
        text: 'The Warehouse system already tells the Order service when a shipment leaves; that is where the status flips.',
      },
      {
        who: 'Senior dev',
        text: 'So the Order service publishes an OrderShipped event to the broker; the Notification service subscribes and sends the mail.',
      },
      {
        who: 'Dev',
        text: 'The Notification service already sends the order confirmation, so the template and the mail provider are in place.',
      },
      {
        who: 'Ops',
        text: 'One new event, one new subscriber, nothing new to deploy for the mail team.',
      },
      {
        who: 'Product owner',
        text: 'Draw it on the whiteboard and refine the ticket. That is small.',
      },
    ],
    outcome: 'Sketch on the whiteboard, decision recorded, ticket refined',
    minutesToDecision: 12,
  },
]

export const vocabulary: { term: string; meaning: string }[] = [
  {
    term: 'Person',
    meaning: 'A human user of your software system, described by role rather than by name.',
  },
  {
    term: 'Software system',
    meaning: 'The highest level of abstraction: something that delivers value to its users, whether human or not.',
  },
  {
    term: 'Container',
    meaning: 'A separately runnable or deployable unit, such as a web app, a service or a database.',
  },
  {
    term: 'Component',
    meaning: 'A grouping of related functionality behind a well-defined interface, living inside one container.',
  },
  {
    term: 'Relationship',
    meaning: 'A one-way line between two elements, labelled with what happens and, where useful, the protocol.',
  },
  {
    term: 'Quantum',
    meaning: 'An independently deployable part with high functional cohesion and its own set of architecture characteristics.',
  },
  {
    term: 'Architecture characteristic',
    meaning: 'A quality the system must have rather than a feature: availability, scalability, testability, the -ilities.',
  },
  {
    term: 'Trade-off',
    meaning: 'What a choice gives you and what it costs you elsewhere; every architecture decision has one.',
  },
]
