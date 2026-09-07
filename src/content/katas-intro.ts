import type { KataAnatomyPart, KataRule, TimelineItem } from './widgets'

/**
 * Content for the /katas page: what a kata card is made of, the rules of a
 * round, where the format comes from, and what a kata is not.
 */
export const kataAnatomy: KataAnatomyPart[] = [
  {
    id: 'description',
    title: 'Description',
    why: 'One paragraph that says what the customer wants to achieve, and hides half of what they actually need.',
    questionsToAsk: [
      'What is the business really paying for here?',
      'Which sentence hides the hardest problem?',
      'What is not mentioned but must exist anyway?',
    ],
  },
  {
    id: 'users',
    title: 'Users',
    why: 'Numbers and roles set the scale, and every role becomes a person on your C1.',
    questionsToAsk: [
      'How many at peak, not on average?',
      'Which users are outside the company?',
      'Who is missing: admins, support, auditors?',
    ],
  },
  {
    id: 'requirements',
    title: 'Requirements',
    why: 'The features, and hidden inside them the architecture characteristics that will drive your decisions.',
    questionsToAsk: [
      'Which requirement is really an -ility in disguise?',
      'Which two requirements pull in opposite directions?',
      'What must never happen?',
    ],
  },
  {
    id: 'context',
    title: 'Additional context',
    why: 'Budget, deadlines, existing systems, regulation: the constraints, and the place where trade-offs are born.',
    questionsToAsk: [
      'What is fixed and what is negotiable?',
      'Which existing system do we have to talk to?',
      'What does the customer expect in a year?',
    ],
  },
]

export const kataRules: KataRule[] = [
  {
    title: 'Groups of three to five',
    detail: 'Small enough that everyone draws, large enough for a disagreement.',
  },
  {
    title: 'Timebox everything',
    detail: 'Fifteen minutes for a design round, eight for feedback. The timer is not a suggestion.',
  },
  {
    title: 'The customer is the facilitator',
    detail: 'Ask them anything. They answer in character and invent details that stay consistent.',
  },
  {
    title: 'No laptops for research',
    detail: 'Any technology is allowed if you can defend it. What the group knows is enough.',
  },
  {
    title: 'Sketch on paper or a whiteboard',
    detail: 'Boxes, lines, sticky notes. Tools slow you down and hide the thinking.',
  },
  {
    title: 'Present, then take the questions',
    detail: 'Every group presents; the other groups ask hard-but-fair questions.',
  },
  {
    title: 'The room votes with thumbs',
    detail: 'Up, sideways or down for every design. Nobody wins; you learn what convinced the room.',
  },
]

export const kataTimeline: TimelineItem[] = [
  {
    year: '2011',
    text: 'Ted Neward publishes Architectural Katas: a group exercise modelled on code katas, with a customer in the room.',
  },
  {
    year: '2012+',
    text: 'Neal Ford curates a public list of katas and runs sessions at conferences.',
  },
  {
    year: '2019+',
    text: 'O’Reilly runs Architectural Katas events, with Mark Richards and Neal Ford judging the teams.',
  },
  {
    year: '2020',
    text: 'Fundamentals of Software Architecture uses katas throughout, from characteristics to styles. The 2nd edition follows in 2025.',
  },
  {
    year: '2024',
    text: 'Mark Richards publishes the lesson "Running an Architecture Kata Session" on Software Architecture Monday.',
  },
]

export const notAKata: string[] = [
  'Not a competition with a right answer. Same kata, different diagrams, none of them wrong.',
  'Not a design review of your real systems. A fictional customer, no politics, no legacy to protect.',
  'Not a tooling workshop. Paper beats any diagramming tool for the first hour.',
  'Not a lecture. The facilitator asks and keeps time; the groups do the thinking.',
]
