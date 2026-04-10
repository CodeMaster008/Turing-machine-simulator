export const BLANK = '□';

export const machines = {
  palindrome: {
    id: 'palindrome',
    name: 'Palindrome',
    cardTag: 'Unit 5',
    description: 'Verifies a string over {a,b} is a palindrome. Marks & erases outermost characters, shrinks inward.',
    tapes: 1,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: 'abba',
    priors: ['a', 'b', BLANK],
    transitions: [
      { state: 'q0', read: 'a', toState: 'q1a', write: BLANK, dir: 'R' },
      { state: 'q0', read: 'b', toState: 'q1b', write: BLANK, dir: 'R' },
      { state: 'q0', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' },
      
      { state: 'q1a', read: 'a', toState: 'q1a', write: 'a', dir: 'R' },
      { state: 'q1a', read: 'b', toState: 'q1a', write: 'b', dir: 'R' },
      { state: 'q1a', read: BLANK, toState: 'q2a', write: BLANK, dir: 'L' },

      { state: 'q2a', read: 'a', toState: 'q3', write: BLANK, dir: 'L' },
      { state: 'q2a', read: 'b', toState: 'qR', write: 'b', dir: 'S' },
      { state: 'q2a', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' },

      { state: 'q1b', read: 'a', toState: 'q1b', write: 'a', dir: 'R' },
      { state: 'q1b', read: 'b', toState: 'q1b', write: 'b', dir: 'R' },
      { state: 'q1b', read: BLANK, toState: 'q2b', write: BLANK, dir: 'L' },

      { state: 'q2b', read: 'b', toState: 'q3', write: BLANK, dir: 'L' },
      { state: 'q2b', read: 'a', toState: 'qR', write: 'a', dir: 'S' },
      { state: 'q2b', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' },

      { state: 'q3', read: 'a', toState: 'q3', write: 'a', dir: 'L' },
      { state: 'q3', read: 'b', toState: 'q3', write: 'b', dir: 'L' },
      { state: 'q3', read: BLANK, toState: 'q0', write: BLANK, dir: 'R' }
    ]
  },
  anbn: {
    id: 'anbn',
    name: 'aⁿbⁿ Recogniser',
    cardTag: 'Unit 3+5',
    description: 'Accepts aⁿbⁿ — a CFL. Bridges Unit 3 (PDA) and Unit 5. TMs strictly generalise PDAs.',
    tapes: 1,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: 'aabb',
    priors: ['a', 'b', 'X', 'Y', BLANK],
    transitions: [
      { state: 'q0', read: 'a', toState: 'q1', write: 'X', dir: 'R' },
      { state: 'q0', read: 'Y', toState: 'q3', write: 'Y', dir: 'R' },
      { state: 'q0', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' },

      { state: 'q1', read: 'a', toState: 'q1', write: 'a', dir: 'R' },
      { state: 'q1', read: 'Y', toState: 'q1', write: 'Y', dir: 'R' },
      { state: 'q1', read: 'b', toState: 'q2', write: 'Y', dir: 'L' },

      { state: 'q2', read: 'a', toState: 'q2', write: 'a', dir: 'L' },
      { state: 'q2', read: 'Y', toState: 'q2', write: 'Y', dir: 'L' },
      { state: 'q2', read: 'X', toState: 'q0', write: 'X', dir: 'R' },

      { state: 'q3', read: 'Y', toState: 'q3', write: 'Y', dir: 'R' },
      { state: 'q3', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' }
    ]
  },
  anbncn: {
    id: 'anbncn',
    name: 'aⁿbⁿcⁿ Recogniser',
    cardTag: 'Unit 5',
    description: 'Accepts aⁿbⁿcⁿ — NOT a CFL! Proves TMs strictly surpass PDAs. The key Unit 4->5 crossover theorem.',
    tapes: 1,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: 'aabbcc',
    priors: ['a', 'b', 'c', 'X', 'Y', 'Z', BLANK],
    transitions: [
      { state: 'q0', read: 'a', toState: 'q1', write: 'X', dir: 'R' },
      { state: 'q0', read: 'Y', toState: 'q4', write: 'Y', dir: 'R' },
      { state: 'q0', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' }, // Epsilon is handled here but not usually needed for anbncn, but fine.
      
      { state: 'q1', read: 'a', toState: 'q1', write: 'a', dir: 'R' },
      { state: 'q1', read: 'Y', toState: 'q1', write: 'Y', dir: 'R' },
      { state: 'q1', read: 'b', toState: 'q2', write: 'Y', dir: 'R' },

      { state: 'q2', read: 'b', toState: 'q2', write: 'b', dir: 'R' },
      { state: 'q2', read: 'Z', toState: 'q2', write: 'Z', dir: 'R' },
      { state: 'q2', read: 'c', toState: 'q3', write: 'Z', dir: 'L' },

      { state: 'q3', read: 'a', toState: 'q3', write: 'a', dir: 'L' },
      { state: 'q3', read: 'b', toState: 'q3', write: 'b', dir: 'L' },
      { state: 'q3', read: 'Y', toState: 'q3', write: 'Y', dir: 'L' },
      { state: 'q3', read: 'Z', toState: 'q3', write: 'Z', dir: 'L' },
      { state: 'q3', read: 'X', toState: 'q0', write: 'X', dir: 'R' },

      { state: 'q4', read: 'Y', toState: 'q4', write: 'Y', dir: 'R' },
      { state: 'q4', read: 'Z', toState: 'q4', write: 'Z', dir: 'R' },
      { state: 'q4', read: BLANK, toState: 'qA', write: BLANK, dir: 'S' }
    ]
  },
  binaryIncrement: {
    id: 'binaryIncrement',
    name: 'Binary Increment',
    cardTag: 'Unit 5',
    description: "Increments a binary number by 1. Scans right to end, carries leftward. Try '1011' -> '1100'.",
    tapes: 1,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: '1011',
    priors: ['0', '1', BLANK],
    transitions: [
      { state: 'q0', read: '0', toState: 'q0', write: '0', dir: 'R' },
      { state: 'q0', read: '1', toState: 'q0', write: '1', dir: 'R' },
      { state: 'q0', read: BLANK, toState: 'q1', write: BLANK, dir: 'L' },
      
      { state: 'q1', read: '1', toState: 'q1', write: '0', dir: 'L' },
      { state: 'q1', read: '0', toState: 'qA', write: '1', dir: 'L' }, // Found a 0, write 1, halt
      { state: 'q1', read: BLANK, toState: 'qA', write: '1', dir: 'L' } // Overflow carry
    ]
  },
  unaryMultiplier: {
    id: 'unaryMultiplier',
    name: 'Unary Multiplier',
    cardTag: 'Unit 5',
    description: 'Computes A×B in unary (input 1^A c 1^B). Demonstrates O(n²) multiplication via repeated addition.',
    tapes: 1,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: '11c111',
    priors: ['1', 'c', 'X', 'Y', 'Z', BLANK],
    transitions: [
      { state: 'q0', read: 'X', toState: 'q0', write: 'X', dir: 'R' },
      { state: 'q0', read: '1', toState: 'q1', write: 'X', dir: 'R' },
      { state: 'q0', read: 'c', toState: 'q_finish', write: BLANK, dir: 'R' },

      { state: 'q1', read: '1', toState: 'q1', write: '1', dir: 'R' },
      { state: 'q1', read: 'c', toState: 'q2', write: 'c', dir: 'R' },

      { state: 'q2', read: 'Y', toState: 'q2', write: 'Y', dir: 'R' },
      { state: 'q2', read: '1', toState: 'q3', write: 'Y', dir: 'R' },
      { state: 'q2', read: 'Z', toState: 'q_resetB', write: 'Z', dir: 'L' },
      { state: 'q2', read: BLANK, toState: 'q_resetB', write: BLANK, dir: 'L' },

      { state: 'q3', read: '1', toState: 'q3', write: '1', dir: 'R' },
      { state: 'q3', read: 'Z', toState: 'q3', write: 'Z', dir: 'R' },
      { state: 'q3', read: BLANK, toState: 'q4', write: 'Z', dir: 'L' },

      { state: 'q4', read: '1', toState: 'q4', write: '1', dir: 'L' },
      { state: 'q4', read: 'Z', toState: 'q4', write: 'Z', dir: 'L' },
      { state: 'q4', read: 'Y', toState: 'q2', write: 'Y', dir: 'R' },

      { state: 'q_resetB', read: 'Y', toState: 'q_resetB', write: '1', dir: 'L' },
      { state: 'q_resetB', read: 'c', toState: 'q_resetB2', write: 'c', dir: 'L' },

      { state: 'q_resetB2', read: '1', toState: 'q_resetB2', write: '1', dir: 'L' },
      { state: 'q_resetB2', read: 'X', toState: 'q0', write: 'X', dir: 'R' },

      { state: 'q_finish', read: '1', toState: 'q_finish', write: BLANK, dir: 'R' },
      { state: 'q_finish', read: 'Y', toState: 'q_finish', write: BLANK, dir: 'R' },
      { state: 'q_finish', read: 'Z', toState: 'q_finish', write: '1', dir: 'R' },
      { state: 'q_finish', read: BLANK, toState: 'qA', write: BLANK, dir: 'L' }
    ]
  },
  fourStateBusyBeaver: {
    id: 'fourStateBusyBeaver',
    name: '4-State Busy Beaver',
    cardTag: 'Unit 5',
    description: 'Writes the maximum possible 13 ones for a 4-state machine. BB(4) winner — directly demonstrates Halting Problem undecidability.',
    tapes: 1,
    startState: 'A',
    acceptState: 'H',
    rejectState: 'qR',
    initialInput: '',
    priors: ['1', '0', BLANK], // Typically BB uses 0 and 1, we map blank to 0 to be visually obvious or BLANK is considered 0. We'll use 1 and BLANK.
    transitions: [
      { state: 'A', read: BLANK, toState: 'B', write: '1', dir: 'R' },
      { state: 'A', read: '1', toState: 'B', write: '1', dir: 'L' },
      { state: 'B', read: BLANK, toState: 'A', write: '1', dir: 'L' },
      { state: 'B', read: '1', toState: 'C', write: BLANK, dir: 'L' },
      { state: 'C', read: BLANK, toState: 'H', write: '1', dir: 'R' },
      { state: 'C', read: '1', toState: 'D', write: '1', dir: 'L' },
      { state: 'D', read: BLANK, toState: 'D', write: '1', dir: 'R' },
      { state: 'D', read: '1', toState: 'A', write: BLANK, dir: 'R' }
    ]
  },
  twoTapeCopy: {
    id: 'twoTapeCopy',
    name: '2-Tape Copy',
    cardTag: 'Unit 5 · 2-TAPE',
    description: 'Copies Tape 1->Tape 2 in O(n). Multi-tape TMs are strictly more time-efficient than single-tape models.',
    tapes: 2,
    startState: 'q0',
    acceptState: 'qA',
    rejectState: 'qR',
    initialInput: ['10110', ''],
    priors: ['0', '1', BLANK],
    transitions: [
      { state: 'q0', read: ['1', BLANK], toState: 'q0', write: ['1', '1'], dir: ['R', 'R'] },
      { state: 'q0', read: ['0', BLANK], toState: 'q0', write: ['0', '0'], dir: ['R', 'R'] },
      { state: 'q0', read: [BLANK, BLANK], toState: 'qA', write: [BLANK, BLANK], dir: ['S', 'S'] }
    ]
  }
};
