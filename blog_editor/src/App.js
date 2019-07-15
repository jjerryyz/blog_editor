import React from 'react';
import { Value } from "slate";
import CannerEditor from "canner-slate-editor";
// import './App.css';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    ]
  }
});

class App extends React.Component {
  // Set the initial state when the app is first constructed.
  state = {
    value: initialValue
  };

  onChange = ({value}) => {
    this.setState({value})
  }

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <CannerEditor
          value={this.state.value} 
          onChange={this.onChange}
           />
      </div>
    );
  }
}

export default App;
