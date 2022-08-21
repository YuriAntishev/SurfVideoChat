import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import VideoChat from './components/VideoChat';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Route path="/videochat" component={VideoChat} />
    </Router>
  )
}

export default App;
