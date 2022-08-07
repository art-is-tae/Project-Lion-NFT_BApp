import axios from "axios";
import { COUNT_CONTRACT_ADDRESS } from "../constants";

const A2A_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET"

export const setCount = (count, setQrvalue) => {

  axios.post(
    A2A_API_PREPARE_URL , {
      bapp: {
        name: APP_NAME
      },
      type: "execute_constract",
      transaction: {
        // "from": '',
        to: COUNT_CONTRACT_ADDRESS,
        value: "0",
        abi: '{ "constatnt": false, "inputs": [ { "internalType": "uint256", "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }',
        params: `["${count}"]`
      }
    }
  ).then((response) => {
    const { request_key } = response.data;
    const qrcode = `https://klipwallet.com/?target=/a2a?requst_key=${request_key}`;
    setQrvalue(qrcode);

    let timerId = setInterval(()=>{
      axios
        .get(
          `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )

        .then((res)=>{
          if (res.data.result) {
            console.log(`[Result ${JSON.stringify(res.data.result)}]`);
            if (res.data.result === 'success') {
              clearInterval(timerId);
            }

        }
      });
    }, 1000);
  });
};

export const getAddress = (setQrvalue, callback) => {

  axios.post(
    A2A_API_PREPARE_URL, {
      bapp: {
        name: APP_NAME
      },
      type: "auth"
    }
  ).then((response) => {
    const { request_key } = response.data;
    const qrcode = `https://klipwallet.com/?target=/a2a?requst_key=${request_key}`;
    setQrvalue(qrcode);

    let timerId = setInterval(()=>{
      axios
        .get(
          `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )

        .then((res)=>{
          if (res.data.result) {
            console.log(`[Result ${JSON.stringify(res.data.result)}]`);
            callback(res.data.result.klaytn_address);
            clearInterval(timerId);
        }
      });
    }, 1000);
  });
};