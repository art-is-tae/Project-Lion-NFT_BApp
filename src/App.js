
import './App.css';
import QRCode from "qrcode.react";
import {getBalance, readCount, setCount} from './api/UseCaver';
import React, { useState } from 'react';
import * as KlipAPI from "./api/UseKlip.js";

const DEFAULT_QR_CODE = "DEFAULT";
function App() {
  const [balance, setBalance] = useState('0');
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  const onClickGetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  }

  const onClickSetCount = () => {
    KlipAPI.setCount(2000, setQrvalue);
  }


  // readCount();
  // getBalance('0x54fb486ef9797f09d68e010dc3925b88fcf2e127');

  return (
    <div className="App">
      <header className="App-header">
        
        <button
          onClick={()=> {
            onClickGetAddress();
          }}
        >
          주소 가져오기
        </button>

        <button
          onClick={()=> {
            onClickSetCount();
          }}
        >
          카운트 값 변경
        </button>

        <br />
        <br />
        <br />
        <QRCode value={qrvalue} />
        <p>{balance}</p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
