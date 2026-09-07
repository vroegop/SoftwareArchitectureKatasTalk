import type { ChecklistDef, FeedbackPrompt, Material } from './widgets'

/**
 * Content for the live pages: group rules, materials, the checklists per C4
 * level, feedback prompts and rotation, debrief prompts and customer reminders.
 */
export const groupRules: string[] = [
  'Three to five people per group; four is the sweet spot.',
  'Mix experience and roles: a junior next to a senior, a tester next to a developer.',
  'One scribe holds the marker and keeps the diagram readable.',
  'One presenter tells the story in the feedback round.',
  'Everyone draws. Watching is not participating.',
]

export const materials: Material[] = [
  {
    item: 'An A3 sheet or a whiteboard per group',
    note: 'Two sheets per group if you plan a C2 round.',
  },
  {
    item: 'Thick markers in two colours',
    note: 'One colour for elements, one for relationships. Thin pens are unreadable from two metres.',
  },
  {
    item: 'Three colours of sticky notes',
    note: 'Yellow for open questions to the customer, pink for risks, green for characteristics.',
  },
  {
    item: 'Painter’s tape',
    note: 'Sheets go on the wall for the feedback round.',
  },
  {
    item: 'A printed kata card per group',
    note: 'Big type, one page. Phones are for photos, not for reading.',
  },
  {
    item: 'A printed C4 legend',
    note: 'Person, system, container, component: the same shapes for every group.',
  },
  {
    item: 'A visible timer',
    note: 'This app on the projector, or a kitchen timer. Everyone must be able to see it.',
  },
]

export const checklists: ChecklistDef[] = [
  {
    id: 'c1',
    title: 'Your C1 must show',
    items: [
      {
        label: 'The system as one box with a name and a one-line purpose',
        hint: 'If you cannot write the purpose in one line, ask the customer.',
      },
      {
        label: 'The people who use it, with roles',
        hint: 'Roles, not names: planner, truck driver, customs officer.',
      },
      {
        label: 'The external systems it talks to',
        hint: 'Anything you do not build or run: the ERP, a payment provider, the equipment fleet.',
      },
      {
        label: 'A labelled line for every relationship, with direction',
        hint: 'A verb on every line, and "uses" does not count.',
      },
      {
        label: 'A title and a legend',
        hint: 'Diagram type, scope and what your shapes mean.',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Your C2 must show',
    items: [
      {
        label: 'Containers with a technology each',
        hint: 'Web app, service, batch job: name the technology, or the type of thing you need.',
      },
      {
        label: 'Data stores',
        hint: 'Every database, cache and file store is a container of its own.',
      },
      {
        label: 'The broker or queue, if you have one',
        hint: 'If you say "event", draw the thing that carries it.',
      },
      {
        label: 'Protocols on the lines',
        hint: 'HTTPS, AMQP, gRPC, a file drop. The protocol tells you the failure mode.',
      },
      {
        label: 'Who owns which data',
        hint: 'One owner per piece of data; the others read copies or ask.',
      },
      {
        label: 'Where the quanta are',
        hint: 'Circle what can deploy, scale and fail on its own.',
      },
    ],
  },
  {
    id: 'c3',
    title: 'If you split for C3',
    items: [
      {
        label: 'One container only',
        hint: 'Pick the one that carries the hardest requirement.',
      },
      {
        label: 'Components with responsibilities',
        hint: 'A name and a one-line job for each.',
      },
      {
        label: 'How they talk',
        hint: 'Direct calls, events, shared state: say which.',
      },
      {
        label: 'What stays outside',
        hint: 'The containers this one talks to, drawn at the edge.',
      },
    ],
  },
]

export const feedbackPrompts: FeedbackPrompt[] = [
  { level: 'C1', prompt: 'Which external system did they forget?' },
  { level: 'C1', prompt: 'Can you tell what the system does from the diagram alone?' },
  { level: 'C1', prompt: 'Is every line a verb?' },
  { level: 'C2', prompt: 'Where does data live, and who owns it?' },
  { level: 'C2', prompt: 'What happens when this container is down?' },
  { level: 'C2', prompt: 'Which container will be the bottleneck?' },
  { level: 'any', prompt: 'What are the top three characteristics this design optimises for?' },
  { level: 'any', prompt: 'What would you have to change if the users doubled?' },
]

export const feedbackRotation: string[] = [
  'Group n reviews group n+1; the last group reviews the first.',
  'Two minutes per pair: one group presents, the other asks.',
  'Then swap, so every group has presented once and reviewed once.',
]

export const debriefPrompts: string[] = [
  'What surprised you in another group’s diagram?',
  'Where did the groups differ, and why?',
  'Which trade-off did you make without noticing?',
  'What question would you ask the customer next time?',
  'What would you draw first next time?',
  'Which vocabulary did you lack?',
]

export const customerReminders: string[] = [
  'Ask about peak load, not average load.',
  'Ask what happens when X fails: the network, a vendor, the payment provider.',
  'Ask what must never happen.',
  'Ask what "done" looks like for the customer.',
]
