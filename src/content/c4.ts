import type { C4Level, NotationCheck } from './widgets'

/**
 * Content for the /c4 page: the abstractions, the four core diagrams, the
 * notation checklist from c4model.com and the supplementary diagrams.
 */
export const c4Abstractions: { name: string; definition: string }[] = [
  {
    name: 'Person',
    definition: 'A human user of the software system, described by role.',
  },
  {
    name: 'Software system',
    definition: 'The highest level of abstraction: something that delivers value to its users, human or not.',
  },
  {
    name: 'Container',
    definition: 'A separately runnable or deployable unit: a web app, a service, a database, a message broker.',
  },
  {
    name: 'Component',
    definition: 'A grouping of related functionality behind a well-defined interface, inside one container.',
  },
  {
    name: 'Code',
    definition: 'Classes, interfaces, functions and the like: what a component is built from.',
  },
]

export const c4Levels: C4Level[] = [
  {
    id: 'C1',
    name: 'System context',
    question: 'What is the system, who uses it and what does it talk to?',
    audience: 'Everybody, including non-technical people',
    shows: [
      'The system as one box',
      'The people who use it',
      'The external systems it depends on',
      'Labelled relationships between them',
    ],
    tip: 'Start every kata here. If you cannot name the users and the external systems yet, ask the customer before you draw anything else.',
  },
  {
    id: 'C2',
    name: 'Container',
    question: 'What are the deployable units and how do they communicate?',
    audience: 'Developers, operations, architects',
    shows: [
      'Applications, services and data stores',
      'The technology of each container',
      'Protocols on the lines',
      'The system boundary',
    ],
    tip: 'One technology per box. If you cannot name it yet, write the type of thing you need, such as "relational database".',
  },
  {
    id: 'C3',
    name: 'Component',
    question: 'What is inside one container and how is it structured?',
    audience: 'Developers and architects working on that container',
    shows: [
      'The major building blocks of one container',
      'Their responsibilities',
      'How they interact',
      'The containers they talk to outside',
    ],
    tip: 'Draw C3 only for the container that carries the risk. Most containers never need one.',
  },
  {
    id: 'C4',
    name: 'Code',
    question: 'How is a component implemented?',
    audience: 'The developers of that component',
    shows: [
      'Classes, interfaces and functions',
      'Their relationships',
      'Only the tricky parts, if any',
    ],
    tip: 'Rarely drawn, and never by hand. Generate it from the code if you need it at all.',
  },
]

export const notationChecks: NotationCheck[] = [
  {
    id: 'title',
    label: 'A title with diagram type and scope',
    why: 'Readers must know at a glance whether they look at a system context or a container view, and of what.',
  },
  {
    id: 'legend',
    label: 'A legend or key',
    why: 'Shapes, colours and line styles mean nothing until you say what they mean.',
  },
  {
    id: 'element-type',
    label: 'Every element typed',
    why: 'Person, software system, container or component: the type tells the reader which zoom level they are at.',
  },
  {
    id: 'element-description',
    label: 'A short description on every element',
    why: 'One line of responsibility turns a box with a name into a statement you can challenge.',
  },
  {
    id: 'technology',
    label: 'Technology on containers and components',
    why: 'Without the technology a container diagram is a wish list; with it, developers and operations can plan.',
  },
  {
    id: 'unidirectional',
    label: 'Unidirectional lines',
    why: 'A double arrow hides who initiates. Two lines with two labels are clearer.',
  },
  {
    id: 'line-intent',
    label: 'Every line labelled with intent, not "uses"',
    why: '"Sends shipment updates to" tells a story; "uses" tells nothing.',
  },
  {
    id: 'acronyms',
    label: 'Acronyms and abbreviations explained',
    why: 'The room includes people who do not know what TOS or ECS stands for.',
  },
  {
    id: 'colours',
    label: 'Colours consistent and readable in black and white',
    why: 'Printed, photographed or projected badly, the diagram must still work. Colour is a bonus, not the carrier.',
  },
]

export const supplementaryDiagrams: { name: string; use: string }[] = [
  {
    name: 'System landscape',
    use: 'All the software systems in an organisation on one sheet, when one C1 is not the whole story.',
  },
  {
    name: 'Dynamic',
    use: 'One scenario, step by step, over the elements of a container or component view; a lightweight sequence diagram.',
  },
  {
    name: 'Deployment',
    use: 'Where containers run: nodes, regions, replicas. Draw it when infrastructure is part of the trade-off.',
  },
]
