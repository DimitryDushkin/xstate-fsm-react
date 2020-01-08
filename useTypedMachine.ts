import React, { FC, useState, useEffect } from "react";
import {
  StateMachine,
  interpret,
  StateSchema,
  EventObject,
  Typestate,
  State
} from "xstate";
import {useConstant} from './useConstant';

export const useTypedMachine = <
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  TState extends Typestate<TContext> = Typestate<TContext>
>(
  machine: StateMachine<TContext, TStateSchema, TEvent, TState>
) => {
  const service = useConstant(() => {
    const s = interpret(machine);
    s.start();

    return s;
  });

  const [current, setCurrent] = useState<State<TContext, TEvent, TStateSchema, TState>>(
    service.state
  );

  useEffect(() => {
    service.onTransition(state => {
      if (state.changed) {
        setCurrent(state);
      }
    });

    // if service.state has not changed React should just bail out from this update
    setCurrent(service.state);

    return () => {
      service.stop();
    };
  }, []);

  return [current, service.send, service] as const;
};