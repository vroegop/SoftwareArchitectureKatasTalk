import type { SessionPhase } from './widgets'

/**
 * Content for the /session-format page: the phases of one kata round in the
 * 90-minute reference schedule, the feedback rules and the facilitator role.
 */
export const sessionPhases: SessionPhase[] = [
  {
    id: 'groups',
    title: 'Form groups',
    minutes: 3,
    goal: 'Get three to five people around a table with a mix of experience and roles.',
    deliverable: 'A group with a scribe and a presenter',
    facilitator: 'Splits the room, breaks up the usual teams and hands out the materials.',
    tips: [
      'Do not sit with your own team; that is the point.',
      'The scribe holds the marker, the presenter holds the story.',
    ],
  },
  {
    id: 'kata',
    title: 'Pick and read the kata',
    minutes: 2,
    goal: 'Everyone reads the whole card, including the context, before anyone draws.',
    deliverable: 'A group that has read the same card',
    facilitator: 'Reads the kata out loud once and points at the timer.',
    tips: [
      'Read the context twice; that is where the trade-offs hide.',
      'Underline every number and every "must".',
    ],
  },
  {
    id: 'questions',
    title: 'Ask the customer',
    minutes: 3,
    goal: 'Close the gaps in the card by asking the customer, not by assuming.',
    deliverable: 'A short list of clarified facts',
    facilitator: 'Plays the customer: answers in character, invents consistent details, says "I do not know" when the customer would not know.',
    tips: [
      'Ask about peak load, failures and what must never happen.',
      'Write the answers on a sticky; the next group will ask the same.',
    ],
    timerPreset: 'clarify',
  },
  {
    id: 'c1',
    title: 'C1 design round',
    minutes: 15,
    goal: 'Draw the system as one box, its users and the external systems it talks to.',
    deliverable: 'One system context diagram on paper, with a title and a legend',
    facilitator: 'Walks the tables, answers customer questions and stops anyone who is already drawing containers.',
    tips: [
      'Label every line with a verb.',
      'If you argue for more than two minutes, draw both and pick later.',
      'Put the top three characteristics on a sticky.',
    ],
    timerPreset: 'c1-round',
  },
  {
    id: 'feedback-1',
    title: 'Feedback on C1',
    minutes: 8,
    goal: 'Every group presents; the others ask hard-but-fair questions.',
    deliverable: 'Open questions on stickies for the facilitator',
    facilitator: 'Keeps the rotation moving, holds the two minutes per group and collects the stickies.',
    tips: [
      'One like, one challenge, one question.',
      'The presenting group answers questions and does not defend.',
    ],
    timerPreset: 'feedback',
  },
  {
    id: 'clarify',
    title: 'Clarify and re-scope',
    minutes: 3,
    goal: 'The customer answers the open questions for the whole room at once.',
    deliverable: 'Shared answers everyone builds on',
    facilitator: 'Groups the stickies, answers them in character and adds a constraint if the room needs a push.',
    tips: [
      'Do not restart your diagram; adjust it.',
      'If an answer changes your top three, say so out loud.',
    ],
    timerPreset: 'clarify',
  },
  {
    id: 'c2',
    title: 'C2 design round',
    minutes: 12,
    goal: 'Zoom into the system box: containers, technologies, data and the lines between them.',
    deliverable: 'A container diagram with a technology on every box',
    facilitator: 'Pushes for a technology on every container and asks where the data lives.',
    tips: [
      'One technology per box; "some database" is not a technology.',
      'Mark the quanta: what can deploy, scale and fail on its own.',
      'If you say "event", draw the broker that carries it.',
    ],
    timerPreset: 'c2-round',
    optional: true,
  },
  {
    id: 'feedback-2',
    title: 'Feedback on C2',
    minutes: 8,
    goal: 'Same rules as before, now about data ownership, failure and bottlenecks.',
    deliverable: 'A second set of stickies and a sharper diagram',
    facilitator: 'Asks "what happens when this container is down" if nobody else does.',
    tips: [
      'Ask where the data lives and who owns it.',
      'Ask which container falls over first.',
    ],
    timerPreset: 'feedback',
    optional: true,
  },
  {
    id: 'c3',
    title: 'Split for C3',
    minutes: 10,
    goal: 'Split the group and zoom into the one container that carries the risk.',
    deliverable: 'A component diagram of one container',
    facilitator: 'Helps each group pick the container that matters and keeps the rest of the room at C2.',
    tips: [
      'Pick the container with the hardest requirement, not the easiest one.',
      'Components have responsibilities, not just names.',
    ],
    optional: true,
  },
  {
    id: 'debrief',
    title: 'Debrief',
    minutes: 5,
    goal: 'Compare the designs and name the trade-off each group made.',
    deliverable: 'One key choice per group, pinned on the board',
    facilitator: 'Leads the round: what surprised you, where did the groups differ, what would you ask next time.',
    tips: [
      'Photograph every sheet before anyone packs up.',
      'End on a question, not on a verdict.',
    ],
  },
]

export const feedbackRules: string[] = [
  'One thing you liked, one thing you would challenge, one question.',
  'Hard but fair: attack the design, never the people.',
  'Two minutes per group, and the timer decides.',
  'The presenting group only answers questions. No defending.',
  'Write every open question on a sticky and hand it to the facilitator.',
]

export const facilitatorRole: string[] = [
  'Plays the customer and answers every question in character.',
  'Keeps time and says so out loud, every round.',
  'Keeps groups from designing the tooling instead of the system.',
  'Injects a constraint when a group is done early: double the users, remove a vendor, add a regulator.',
  'Leads the debrief and makes sure every group names one trade-off.',
]

export const whenToSkipFacilitator =
  'Only when the kata is unusually complete and the group has run katas before; even then, someone keeps time.'
