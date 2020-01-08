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

function App() {
  const [state, send] = useTypedMachine(scrollOutMachine);

  useEffect(() => {
    fromEvent(doc)
  })

  return (
    <div className="App" style={{height: '200vh'}}>
      <button onClick={() => send(MachineEvent.Next)}>Next</button>
      <button onClick={() => send(MachineEvent.Prev)}>Prev</button>
      <SiteLib state={state} />
    </div>
  );
}

const SiteLib: FC<{ state: ScrollOutState }> = ({state}) => {
  const styles = {
    [MachineState.Hidden]: {position: 'absolute', transform: 'translateY(100%)'},
    [MachineState.HiddenToPreview]: {position: 'absolute', transform: 'translateY(80%)'},
    [MachineState.Preview]: {position: 'absolute', transform: 'translateY(80%)'},
    [MachineState.PreviewToFullscreen]: {position: 'absolute', transform: 'translateY(0%)'},
    [MachineState.Fullscreen]: {position: 'absolute', transform: 'translateY(0%)'},
  };

  return (
    <div style={{ 
      height: "100vh", 
      width: '90%', 
      backgroundColor: "rgb(211, 232, 244)",
      transition: 'transform 200ms',
      ...styles[state.value] 
    }}>{state.value}</div>
  );
};

const rootElement = document.getElementById("root");
render(<App />, rootElement);
