import React from "react";
import ReactDOM from "react-dom";
import { Switch } from "./switch";
import {
  identity,
  assoc,
  always,
  objReduce,
  Identity,
  Either,
  Right,
  Left
} from "./library";

const setStateWithReducer = (state, props) =>
  Identity.of({
    on: !state.on,
    type: Toggle.stateChangeTypes.toggle
  })
    .map(c => (props.stateReducer ? props.stateReducer(state, c) : c))
    .fold(c => mapToSettableState(c, props));

const settableReducer = (props, acc, val, key, obj) =>
  props[key] === undefined && key !== "type" ? assoc(acc, key, val) : acc;

const mapToSettableState = (changes, props) =>
  Either.of(objReduce(changes, settableReducer.bind(null, props)))
    .chain(
      settableState =>
        Object.keys(settableState).length
          ? Right(settableState)
          : Left(settableState)
    )
    .fold(x => null, identity);

class Toggle extends React.Component {
  state = { on: false };
  static stateChangeTypes = { toggle: "__toggle__" };
  toggle = e =>
    this.setState(
      setStateWithReducer,
      this.props.onToggle.bind(null, this.state.on)
    );

  render() {
    return <Switch on={this.state.on || this.props.on} onClick={this.toggle} />;
  }
}

class App extends React.Component {
  state = { totalClicks: 0 };
  maxClicks = 3;

  toggleReducer = (state, changes) =>
    this.state.totalClicks > this.maxClicks
      ? { ...changes, on: state.on }
      : changes;

  handleToggle = on =>
    this.setState(({ totalClicks }) => ({ totalClicks: totalClicks + 1 }));

  render() {
    return (
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <Toggle
          stateReducer={this.toggleReducer}
          onToggle={this.handleToggle}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
