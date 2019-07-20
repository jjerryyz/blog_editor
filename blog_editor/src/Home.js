import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return(<Link to="/auth/login">click</Link>)
    }
}

export default Home