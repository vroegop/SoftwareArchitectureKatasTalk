import type { AgendaItem, PlaybookSection, SessionVariant, Takeaway } from './widgets'

/**
 * Content for the /playbook, /title and /closing pages: how to run a kata
 * session at your own company, the session variants, the agendas and the
 * three takeaways.
 */
export const playbookSections: PlaybookSection[] = [
  {
    id: 'before',
    title: 'Before',
    items: [
      {
        label: 'Pick two katas',
        detail: 'One for the session, one spare in case the first is too close to your own domain.',
      },
      {
        label: 'Book a room with wall space',
        detail: 'Sheets go on the wall for the feedback round; a boardroom table does not work.',
      },
      {
        label: 'Gather the materials',
        detail: 'Sheets, thick markers, three colours of stickies, tape, a timer.',
      },
      {
        label: 'Invite a mix',
        detail: 'Juniors, seniors, testers, ops, a product owner. Twelve to twenty people is the sweet spot.',
      },
      {
        label: 'Decide who facilitates',
        detail: 'Someone who can play the customer and say no to designing the tooling.',
      },
      {
        label: 'Print kata cards and C4 legends',
        detail: 'One card and one legend per group, in big type.',
      },
      {
        label: 'Set the timeboxes',
        detail: 'Write them on the wall before people arrive: fifteen, eight, three, twelve, eight, five.',
      },
    ],
  },
  {
    id: 'during',
    title: 'During',
    items: [
      {
        label: 'Form groups of three to five',
        detail: 'Break up the usual teams; mixed groups learn more.',
      },
      {
        label: 'Read the kata and ask the customer',
        detail: 'Two minutes of reading, three minutes of questions, before anyone draws.',
      },
      {
        label: 'C1 round, fifteen minutes',
        detail: 'System, people, external systems, labelled lines. Stop anyone drawing containers.',
      },
      {
        label: 'Feedback round, eight minutes',
        detail: 'Group n reviews group n+1. One like, one challenge, one question.',
      },
      {
        label: 'Clarify and re-scope',
        detail: 'Answer the stickies for the whole room. Add a constraint if a group finished early.',
      },
      {
        label: 'C2 round and second feedback, if time',
        detail: 'Containers with technology, data stores, protocols, quanta.',
      },
      {
        label: 'Debrief',
        detail: 'Same kata, different diagrams, none wrong. Every group names one trade-off.',
      },
    ],
  },
  {
    id: 'after',
    title: 'After',
    items: [
      {
        label: 'Photograph every diagram',
        detail: 'Before anyone packs up. Sheets get lost; photos do not.',
      },
      {
        label: 'Write one ADR-style paragraph per group',
        detail: 'Context, decision, consequences. The group writes it, not the facilitator.',
      },
      {
        label: 'Share in the team channel',
        detail: 'Photos plus paragraphs, the same day, while it is fresh.',
      },
      {
        label: 'Note the vocabulary gaps',
        detail: 'Words people lacked or used differently become the theme of the next session.',
      },
      {
        label: 'Schedule the next one',
        detail: 'Before you leave the room. Monthly is a rhythm; "sometime" is not.',
      },
    ],
  },
  {
    id: 'scaling',
    title: 'Scaling and rhythm',
    items: [
      {
        label: 'One facilitator per twenty people',
        detail: 'Plus an assistant for every ten more, to walk the tables and keep time.',
      },
      {
        label: 'Monthly rhythm',
        detail: 'Ninety minutes, same slot, same room. Attendance grows when people know when it is.',
      },
      {
        label: 'Rotate facilitators',
        detail: 'Playing the customer is the fastest way to learn to ask better questions.',
      },
      {
        label: 'Start with C1-only lunch katas',
        detail: 'Sixty minutes, one round, low ceremony. Add C2 when the room asks for it.',
      },
      {
        label: 'Alternate public katas with your own systems',
        detail: 'Once the language is shared, redraw a real system and let the room find the holes.',
      },
    ],
  },
]

export const sessionVariants: SessionVariant[] = [
  {
    title: 'Lunch kata',
    duration: '60 min',
    description: 'C1 only. Low ceremony, easy to repeat, a good first session.',
    agenda: [
      '0:00 Groups and kata',
      '0:05 Ask the customer',
      '0:10 C1 design round',
      '0:25 Feedback round',
      '0:35 Clarify and adjust',
      '0:45 Debrief',
      '0:55 Photos and next date',
    ],
  },
  {
    title: 'Dev Cafe format',
    duration: '90 min',
    description: 'This talk’s format: a short intro, then C1, feedback, clarify and an optional C2 round.',
    agenda: [
      '0:00 Why katas, and C4 in four minutes',
      '0:10 Groups, kata, ask the customer',
      '0:15 C1 design round',
      '0:30 Feedback on C1',
      '0:38 Clarify and re-scope',
      '0:41 C2 design round and feedback (optional)',
      '1:01 Split for C3 if time, then debrief',
    ],
  },
  {
    title: 'Full-day dojo',
    duration: 'a day',
    description: 'Three or four iterations on one kata. Change a constraint every round and watch the design move.',
    agenda: [
      '0:00 Intro and C4 refresher',
      '0:30 Iteration 1: C1, feedback, clarify',
      '2:00 Iteration 2: add a constraint, C2, feedback',
      '3:30 Lunch',
      '4:30 Iteration 3: new kata or new groups',
      '6:00 Iteration 4: split for C3, risk storming',
      '7:00 Debrief and ADRs',
    ],
  },
]

export const firstKataAgenda: AgendaItem[] = [
  { minute: 0, label: 'Welcome, groups of three to five, hand out the kata' },
  { minute: 5, label: 'Read the kata, ask the customer' },
  { minute: 10, label: 'C1 design round' },
  { minute: 25, label: 'Feedback round: group n reviews group n+1' },
  { minute: 33, label: 'Clarify with the customer, adjust the diagram' },
  { minute: 40, label: 'Present the adjusted C1, thumbs from the room' },
  { minute: 50, label: 'Debrief, photos, schedule the next one' },
]

export const takeaways: Takeaway[] = [
  {
    title: 'Practice beats talent',
    detail: 'Nobody gets good at architecture by doing it twice a decade. A kata a month is the repetition the job never gives you.',
  },
  {
    title: 'One language',
    detail: 'C4 gives juniors, seniors and the business the same four words and the same picture. Small changes get designed in minutes.',
  },
  {
    title: 'Trade-offs you can explain',
    detail: 'The laws, the star ratings and risk storming turn "I think" into "we chose this because", written down.',
  },
]

export const talkAgenda: AgendaItem[] = [
  { minute: 0, label: 'Why this matters' },
  { minute: 10, label: 'Katas and C4' },
  { minute: 27, label: 'The session loop' },
  { minute: 32, label: 'Architectural thinking and the nine styles' },
  { minute: 47, label: 'Westhaven: the design' },
  { minute: 52, label: 'Risk storming' },
  { minute: 57, label: 'Live round' },
  { minute: 86, label: 'Run it yourself' },
]

export const testOnPaperSiblings: { name: string; oneLiner: string; url?: string }[] = [
  {
    name: 'What-if scenario cards',
    oneLiner: 'Pick a scenario, such as "the vendor doubles its prices", and walk the diagram to see what breaks.',
  },
  {
    name: 'Architecture Decision Records',
    oneLiner: 'One page per decision: context, decision, consequences. The why, written down before it is forgotten.',
    url: 'https://adr.github.io',
  },
  {
    name: 'Fitness functions',
    oneLiner: 'Automated checks that a characteristic still holds, from Building Evolutionary Architectures.',
  },
  {
    name: 'The kata itself',
    oneLiner: 'The cheapest test of all: draw it, present it, and let the room find the holes.',
  },
]
