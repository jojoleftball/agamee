export interface Dialogue {
  id: string;
  character: 'soly' | 'maria' | 'baby' | 'both';
  text: string;
  nextId?: string;
}

export interface DialogueChain {
  id: string;
  title: string;
  chapter: number;
  dialogues: Dialogue[];
}

export const DIALOGUE_CHAINS: DialogueChain[] = [
  {
    id: 'intro',
    title: 'Welcome to Our Beach House',
    chapter: 1,
    dialogues: [
      {
        id: 'd1',
        character: 'soly',
        text: 'Hey Maria! Can you believe it? We finally found our dream beach house!',
        nextId: 'd2'
      },
      {
        id: 'd2',
        character: 'maria',
        text: 'I know, Soly! It\'s perfect! Though... it needs a lot of work, doesn\'t it?',
        nextId: 'd3'
      },
      {
        id: 'd3',
        character: 'soly',
        text: 'That\'s what makes it exciting! We can make it exactly how we want it. Plus, our little one will grow up here!',
        nextId: 'd4'
      },
      {
        id: 'd4',
        character: 'maria',
        text: 'You\'re right! Let\'s start by cleaning up and gathering some materials. I have a feeling this is going to be an amazing adventure!',
      }
    ]
  },
  {
    id: 'first_merge',
    title: 'First Steps',
    chapter: 1,
    dialogues: [
      {
        id: 'd1',
        character: 'maria',
        text: 'Great job on that merge! See? We\'re already making progress!',
        nextId: 'd2'
      },
      {
        id: 'd2',
        character: 'soly',
        text: 'One step at a time, together. That\'s how we\'ll build our dream home!',
      }
    ]
  },
  {
    id: 'garden_start',
    title: 'The Garden',
    chapter: 2,
    dialogues: [
      {
        id: 'd1',
        character: 'maria',
        text: 'Look at all these seeds! I think we should start a garden. Fresh flowers would make the house feel so welcoming.',
        nextId: 'd2'
      },
      {
        id: 'd2',
        character: 'soly',
        text: 'I love that idea! Plus, the baby will love playing in a garden when they\'re older.',
        nextId: 'd3'
      },
      {
        id: 'd3',
        character: 'maria',
        text: 'Exactly what I was thinking! Let\'s make this the most beautiful beach house garden ever!',
      }
    ]
  }
];

export function getDialogueById(dialogueChainId: string): DialogueChain | undefined {
  return DIALOGUE_CHAINS.find(chain => chain.id === dialogueChainId);
}

export function getDialoguesForChapter(chapter: number): DialogueChain[] {
  return DIALOGUE_CHAINS.filter(chain => chain.chapter === chapter);
}
