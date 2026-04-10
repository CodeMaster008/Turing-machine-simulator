import { useState, useCallback, useRef, useEffect } from 'react';
import { BLANK } from './examples';

const initializeTapes = (initialInput, numTapes) => {
  const tapes = [];
  const inputs = Array.isArray(initialInput) ? initialInput : [initialInput];
  
  for (let i = 0; i < numTapes; i++) {
    const inputStr = inputs[i] || '';
    const cells = {};
    let minIndex = 0;
    let maxIndex = 0;
    
    if (inputStr.length === 0) {
      cells[0] = BLANK;
    } else {
      for (let j = 0; j < inputStr.length; j++) {
        cells[j] = inputStr[j];
      }
      maxIndex = Math.max(0, inputStr.length - 1);
    }
    
    tapes.push({
      cells,
      head: 0,
      minIndex,
      maxIndex,
      writtenCells: new Set()
    });
  }
  return tapes;
};

// Deep copy the tapes Array (and the internal Set)
const cloneTapes = (tapes) => {
  return tapes.map(t => ({
    cells: { ...t.cells },
    head: t.head,
    minIndex: t.minIndex,
    maxIndex: t.maxIndex,
    writtenCells: new Set(t.writtenCells)
  }));
};

export function useTuringMachine(machineDef) {
  const [history, setHistory] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [speed, setSpeedState] = useState(300);
  const speedRef = useRef(300);
  const isRunningRef = useRef(false);
  const timeoutIdRef = useRef(null);

  // Initialize machine state
  const reset = useCallback((newInput = null) => {
    const input = newInput !== null ? newInput : machineDef.initialInput;
    const initialTapes = initializeTapes(input, machineDef.tapes || 1);
    
    const initialState = {
      tapes: initialTapes,
      state: machineDef.startState,
      status: 'paused', // paused, running, accepted, rejected
      stats: { steps: 0, writes: 0, cellsUsed: 0, runs: 0 },
      logStr: `Loaded "${machineDef.name}" | input: "${Array.isArray(input) ? input.join(',') : input}"`,
    };

    setHistory([initialState]);
    setCurrentStepIndex(0);
    isRunningRef.current = false;
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  }, [machineDef]);

  // Handle machine loading automatically when the definition changes
  useEffect(() => {
    reset();
  }, [machineDef, reset]);

  const step = useCallback(() => {
    let nextStateObj = null;

    setHistory(prevHistory => {
      // Always step from the END of the history, or if scrubbed back, we branch!
      // Here we assume if they step while scrubbed back, we truncate the future.
      const activeHistory = prevHistory.slice(0, currentStepIndex + 1);
      const curr = activeHistory[activeHistory.length - 1];

      if (curr.status === 'accepted' || curr.status === 'rejected') {
        return activeHistory;
      }

      // Read symbols
      const currentSymbols = curr.tapes.map(t => t.cells[t.head] || BLANK);

      // Transition match
      let transition = null;
      for (const t of machineDef.transitions) {
        if (t.state === curr.state) {
          let match = true;
          if (machineDef.tapes > 1) {
            for (let i = 0; i < machineDef.tapes; i++) {
              if (t.read[i] !== currentSymbols[i]) { match = false; break; }
            }
          } else {
            if (t.read !== currentSymbols[0]) match = false;
          }
          if (match) { transition = t; break; }
        }
      }

      if (!transition) {
        // Halt/Reject implicitly
        nextStateObj = {
          ...curr,
          tapes: cloneTapes(curr.tapes),
          status: 'rejected',
          state: machineDef.rejectState,
          logStr: `${curr.state} ([${currentSymbols.join(',')}]) -> REJECT (No Transition)`,
        };
        nextStateObj.stats.runs += 1;
        isRunningRef.current = false;
        setCurrentStepIndex(activeHistory.length);
        return [...activeHistory, nextStateObj];
      }

      // Apply transition
      const newTapes = cloneTapes(curr.tapes);
      let newWrites = 0;

      for (let i = 0; i < (machineDef.tapes || 1); i++) {
        const tape = newTapes[i];
        const writeSymbol = machineDef.tapes > 1 ? transition.write[i] : transition.write;
        const dir = machineDef.tapes > 1 ? transition.dir[i] : transition.dir;

        if (tape.cells[tape.head] !== writeSymbol && writeSymbol !== undefined) {
          tape.cells[tape.head] = writeSymbol;
          tape.writtenCells.add(tape.head);
          newWrites++;
        }

        if (dir === 'R') tape.head++;
        else if (dir === 'L') tape.head--;

        if (tape.head < tape.minIndex) tape.minIndex = tape.head;
        if (tape.head > tape.maxIndex) tape.maxIndex = tape.head;
      }

      let totalCellsUsed = 0;
      for (const t of newTapes) {
        totalCellsUsed += (t.maxIndex - t.minIndex + 1);
      }

      const readStr = machineDef.tapes > 1 ? `[${currentSymbols.join(',')}]` : currentSymbols[0];
      const writeStr = machineDef.tapes > 1 ? `[${transition.write.join(',')}]` : transition.write;
      const dirStr = machineDef.tapes > 1 ? `[${transition.dir.join(',')}]` : transition.dir;

      let nextStatus = 'paused';
      if (transition.toState === machineDef.acceptState) nextStatus = 'accepted';
      if (transition.toState === machineDef.rejectState) nextStatus = 'rejected';

      nextStateObj = {
        tapes: newTapes,
        state: transition.toState,
        status: nextStatus,
        stats: {
          steps: curr.stats.steps + 1,
          writes: curr.stats.writes + newWrites,
          cellsUsed: totalCellsUsed,
          runs: curr.stats.runs + (nextStatus === 'accepted' || nextStatus === 'rejected' ? 1 : 0)
        },
        logStr: `${curr.state} (${readStr}) -> ${transition.toState} (${writeStr}, ${dirStr})`
      };

      if (nextStatus === 'accepted' || nextStatus === 'rejected') {
         isRunningRef.current = false;
      }

      setCurrentStepIndex(activeHistory.length);
      
      // Memory limit safeguard (keep history array from exploding beyond 15000 items)
      if (activeHistory.length > 15000) {
        // We shift the first meaningful step out
        isRunningRef.current = false;
        console.warn("Max history limit reached to preserve memory in UI.");
      }
      return [...activeHistory, nextStateObj];
    });
  }, [machineDef, currentStepIndex]);

  const run = useCallback(() => {
    // Cannot branch start from a done state
    let safetyCheckLastStatus = 'paused';
    setHistory(h => {
        const cs = h[currentStepIndex];
        safetyCheckLastStatus = cs.status;
        return h;
    });
    if (safetyCheckLastStatus === 'accepted' || safetyCheckLastStatus === 'rejected') return;

    isRunningRef.current = true;

    // Rescheduling loop resolving via dynamic speedRef reading
    const processTick = () => {
      if (!isRunningRef.current) return;
      step();
      // Only reschedule if step didn't inherently flip isRunningRef false (ex: completion)
      if (isRunningRef.current) {
         timeoutIdRef.current = setTimeout(processTick, speedRef.current);
      }
    };
    
    timeoutIdRef.current = setTimeout(processTick, speedRef.current);
  }, [step, currentStepIndex]);

  const pause = useCallback(() => {
    isRunningRef.current = false;
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  }, []);

  const fastForward = useCallback(() => {
    let safetyCheckLastStatus = 'paused';
    setHistory(h => {
        const cs = h[currentStepIndex];
        safetyCheckLastStatus = cs.status;
        return h;
    });
    if (safetyCheckLastStatus === 'accepted' || safetyCheckLastStatus === 'rejected') return;

    isRunningRef.current = true;
    
    // Non-blocking aggressive interval 
    timeoutIdRef.current = setInterval(() => {
      if (!isRunningRef.current) {
        clearInterval(timeoutIdRef.current);
        return;
      }
      step();
    }, 0);
  }, [step, currentStepIndex]);

  const setSpeed = useCallback((val) => {
    speedRef.current = val;
    setSpeedState(val);
  }, []);

  const setScrubberIndex = useCallback((index) => {
    pause(); // user moving slider
    setCurrentStepIndex(Math.max(0, Math.min(index, history.length - 1)));
  }, [history.length, pause]);

  // Derived active state bounds for the UI mapping
  const currentState = history[currentStepIndex] || {
    tapes: [], state: '', status: '', stats: {steps:0, writes:0, cellsUsed:0, runs:0}, logStr: ''
  };

  return {
    tapes: currentState.tapes,
    state: currentState.state,
    status: isRunningRef.current ? 'running' : currentState.status,
    stats: { ...currentState.stats, historyCount: history.length },
    logs: history.slice(0, currentStepIndex + 1).map(h => h.logStr),
    history,
    currentStepIndex,
    setScrubberIndex,
    speed,
    step,
    run,
    pause,
    reset,
    fastForward,
    setSpeed
  };
}
