import React from 'react';
import './App.css';
//import 'h8k-components';
import AUSPIN_logo from './logo_auspin.webp'

import Slides from './components/Slides';
const title = "AUSPIN Quer Saber";

function App({slides}) {
    return (
        <div>
            <div className="App">
                <Slides slides={slides} />        
            </div>
            <div className="logo">
                <img  style={{ width: 280 }} src={AUSPIN_logo} alt="Logo Auspin" />
            </div>
        </div>
        
    );
}


export default App;
