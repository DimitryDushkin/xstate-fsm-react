import { createMachine, State } from "xstate";

export enum MachineState {
  Hidden = "Hidden",
  HiddenToPreview = "HiddenToPreview",
  Preview = "Preview",
  PreviewToFullscreen = "PreviewToFullscreen",
  Fullscreen = "Fullscreen"
}

export enum MachineEvent {
  Next = 'Next',
  Prev = 'Prev',
}

type MachineTypeState = { value: MachineState; context: any };
export type ScrollOutEvent = {type: MachineEvent};
export type ScrollOutState = State<any, any, any, MachineTypeState>;

export const scrollOutMachine = createMachine<any, ScrollOutEvent, MachineTypeState>({
  id: "state",
  initial: MachineState.Hidden,
  states: {
    [MachineState.Hidden]: {
      on: {
        [MachineEvent.Next]: MachineState.HiddenToPreview,
      }
    },
    [MachineState.HiddenToPreview]: {
      on: {
        [MachineEvent.Next]: MachineState.Preview,
        [MachineEvent.Prev]: MachineState.Hidden
      }
    },
    [MachineState.Preview]: {
      on: {
        [MachineEvent.Next]: MachineState.PreviewToFullscreen,
        [MachineEvent.Prev]: MachineState.HiddenToPreview
      }
    },
    [MachineState.PreviewToFullscreen]: {
      on: {
        [MachineEvent.Next]: MachineState.Fullscreen,
        [MachineEvent.Prev]: MachineState.Preview
      }
    },
    [MachineState.Fullscreen]: {
      on: {
        [MachineEvent.Prev]: MachineState.PreviewToFullscreen
      }
    }
  }
});
