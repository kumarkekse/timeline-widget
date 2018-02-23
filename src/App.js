import React, { Component } from 'react';
import './App.css';
import TimelineSection from './components/TimelineSection';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div className="App-intro">
          <TimelineSection></TimelineSection>
        </div>
      </div>
    );
  }
}

export default App;
