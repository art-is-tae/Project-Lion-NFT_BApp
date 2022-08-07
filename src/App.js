import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import './market.css';
import QRCode from "qrcode.react";// eslint-disable-next-line 
import {getBalance, readCount, setCount} from './api/UseCaver';
import React, { useState } from 'react';
import * as KlipAPI from "./api/UseKlip.js";
import { Alert, Container } from "react-bootstrap"

const DEFAULT_QR_CODE = "DEFAULT";// eslint-disable-next-line 
const DEFAULT_ADDRESS = "0x00000000000000000000000000";


function App() {
  // const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState('0x00000000000000000000000000');
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);

  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = getBalance(address);
      setMyBalance(_balance);
    });
  };

  return (
    <div className="App">
      <div style={{ backgroundColor: "black" , padding: 10 }}>
        <div 
          style={{
            fontSize: 30, 
            fontWeight: "bold", 
            paddingLeft: 5, 
            marginTop: 10 
          }}
        > 내 지갑 
        </div>
        {myAddress}
        <br />
        <Alert
          onClick={getUserData}
          variant={'balance'}
          style={{ backgroundColor: "#f40075", fontSize: 25 }}
        >
          {myBalance}
        </Alert>
      </div>

        {/* 주소 잔고 */}
      <Container 
        style={{
          backgroundColor: 'white',
          width: 300,
          height: 300,
          padding: 20,
        }}
      >
        <QRCode value={qrvalue} size={256} style={{ margin: 'auto' }}/>
      </Container>

        {/* 갤러리 (마켓, 내 지갑)*/}
        {/* 발행 페이지 */}
        {/* 탭 */}
        {/* 모달 */}
        
    </div>
  );
}

export default App;
