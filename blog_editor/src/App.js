import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './Login';
import MyEditor from './MyEditor';
import Home from './Home';

class App extends React.Component {

    go=(index)=> {
        console.log(index)
        this.setState({index: index})
    }

    render() {
        return (
        <Router>
            <div className="inner">
                <Route path="/home" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/entry" component={MyEditor} />
            </div>
        </Router>)
    }
}

export default App