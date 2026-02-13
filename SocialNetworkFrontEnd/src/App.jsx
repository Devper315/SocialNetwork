import './App.css';
import React from 'react';
import Header from './components/common/Header';
import Body from './components/common/Body';
import { MenuProvider } from './contexts/MenuContext';

function App() {
    return (
        <div className="App">
            <MenuProvider>
                <Header />
                <Body />
            </MenuProvider>

        </div>
    );
}

export default App;
