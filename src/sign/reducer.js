function getStartState() {
  return {
  };
}

const START_STATE = getStartState();

export default function signData(state = START_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}
