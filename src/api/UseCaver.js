import Caver from 'caver-js';
import CounterABI from '../abi/CounterAPI.json';
import { ACCESS_KEY_ID, SECRET_KEY_ID, COUNT_CONTRACT_ADDRESS, CHAIN_ID } from '../constants/index.js'

const option = {
  headers: [
    {name: 'Authorization', value: 'Basic ' + Buffer.from(ACCESS_KEY_ID + ':' + SECRET_KEY_ID).toString('base64')},
    {name: 'x-chain-id', value: CHAIN_ID},
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))

const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

export const readCount = async () => { 
  const _count = await CountContract.methods.count().call();
  console.log(_count);
}

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.  convertFromPeb(caver.utils.hexToNumberString(response));
    console.log(`BLANCE: ${balance}`);
    return balance;
  })
}

export const setCount = async (newCount) => {
  // 사용할 account 설정
  try {
    const privateKey = '0x443c53d55e7f4bc494aca399d15644e34f3335b14966e6f753d240ebb66ba93a';
    const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
    caver.wallet.add(deployer);
  
    // 스마트 컨트랙트 실행 트랜잭션 날리기
    // 결과 확인
  
    const receipt = await CountContract.methods.setCount(newCount).send({
      from: deployer.address, //address
      gas: "0x4bfd200" //
    });

    console.log(receipt);
  } catch(e) {
    console.log(`[ERROR_SET_COUNT]${e}`)
  }

}