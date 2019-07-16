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

  componentDidMount() {
    fetch('http://localhost:8080/entry/title',{
      method: 'GET', 
      // A mode: 'no-cors' request makes the response type opaque. The console-log snippet in the question clearly shows that. And opaque means your frontend JavaScript code can’t see the response body or headers.
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then(response => console.log(JSON.stringify(response)))
    .catch(error => console.log(error));
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
