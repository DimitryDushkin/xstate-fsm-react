import React, { FC, useState, useEffect } from "react";
import { render } from "react-dom";
import {
  StateMachine,
  interpret,
  StateSchema,
  EventObject,
  Typestate,
  State
} from "xstate";
import {fromEvent} from 'rxjs';
import { scrollOutMachine, MachineState, MachineEvent, ScrollOutState } from "./scrollOutMachine";
import {useTypedMachine} from './useTypedMachine';

// 1. Custom point from hidden to HiddenToPreview
// 2. Add parallel state "No scroll response"
// 3. What layout on Fullscreen state?
// Fullscreen -> position: absolute
// Fullscreen + No scroll response -> position: static + remove article?

const SCROLL_Y_TO_MACHINE_STATE = [
  [0, 400, MachineState.Hidden],
  [401, 600, MachineState.HiddenToPreview],
  [601, 800, MachineState.Preview],
  [801, 1000, MachineState.PreviewToFullscreen],
  [1001, 1300, MachineState.Fullscreen],
] as const;

const styles = {
  [MachineState.Hidden]: {position: 'fixed', transform: 'translateY(100%)'},
  [MachineState.HiddenToPreview]: {position: 'fixed', transform: 'translateY(80%)'},
  [MachineState.Preview]: {position: 'fixed', transform: 'translateY(80%)'},
  [MachineState.PreviewToFullscreen]: {position: 'fixed', transform: 'translateY(0%)'},
  [MachineState.Fullscreen]: {position: 'fixed', transform: 'translateY(0%)'},
};

const getStateByScrollY = (scrollY: number) => {
  for (const tuple of SCROLL_Y_TO_MACHINE_STATE) {
    if (scrollY >= tuple[0] && scrollY <= tuple[1]) {
      console.log(scrollY, tuple[2]);
      return tuple[2];
    }
  }
}

function App() {
  const [state, send] = useTypedMachine(scrollOutMachine);

  const [machineState, setMachineState] = useState(MachineState.Hidden);

  useEffect(() => {
    fromEvent(document, 'scroll').subscribe(() => {
      const nextState = getStateByScrollY(window.scrollY);
      if (nextState) {
        setMachineState(nextState);
      }
    });
  }, [])

  return (
    <div className="App" style={{height: '300vh'}}>
      <button onClick={() => send(MachineEvent.Next)}>Next</button>
      <button onClick={() => send(MachineEvent.Prev)}>Prev</button>
      <SiteLib state={machineState} />
    </div>
  );
}

const SiteLib: FC<{ state: MachineState }> = ({state}) => {


  return (
    <div style={{ 
      height: "100vh", 
      width: '90%', 
      top: 0,
      left: 0,
      backgroundColor: "rgb(211, 232, 244)",
      transition: 'transform 200ms',
      ...styles[state] 
    }}>{state}</div>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
