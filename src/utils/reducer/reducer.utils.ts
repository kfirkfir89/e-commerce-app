import { AnyAction } from 'redux';

// type predicate
// AC = action creator
type Matchable<AC extends () => AnyAction> = AC & {
  type: ReturnType<AC>['type'];
  match(action: AnyAction): action is ReturnType<AC>;
};

export function withMatcher<AC extends () => AnyAction & { type: string }>(actionCreator: AC): Matchable<AC>;

export function withMatcher<AC extends (...args: any[]) => AnyAction & { type: string }>(actionCreator: AC): Matchable<AC>;

export function withMatcher(actionCreator: Function) {
  const { type } = actionCreator();
  return Object.assign(actionCreator, {
    type,
    match(action: AnyAction) {
      return action.type === type;
    },
  });
}

export type ActionWithPayload<T, P> = {
  type: T;
  payload: P;
};

export type Action<T> = {
  type: T;
};

// function overload
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>; 

export function createAction<T extends string>(type: T, payload: void): Action<T>; 

export function createAction<T extends string, P>(type: T, payload: P) {
  return { type, payload };
}
