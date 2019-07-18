import React from 'react';
import { Value } from "slate";
import CannerEditor from "canner-slate-editor";
// import './App.css';
import config from './config'

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

    const url = config.base_url + '/entry/title';
    fetch(url)
    .then(response => console.log(JSON.stringify(response.data)))
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
