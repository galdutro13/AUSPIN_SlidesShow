import React from 'react';
import './App.css';
import 'h8k-components';
import logo from './logo_auspin.webp'

import Slides from './components/Slides';
const title = "AUSPIN Quer Saber";

function App({slides}) {
    return (
        <div>
            <nav class="app-header">
                <div class="layout-row align-items-center justify-content-center">
                    <img src={logo} class="logo" />
                    <h4 id="app-title" class="app-title ml-16 my-0">AUSPIN Quer Saber</h4>
                </div>
            </nav>
        <div className="App">
                <Slides slides={slides} />
            </div>
        </div>
    );
}

export default App;
