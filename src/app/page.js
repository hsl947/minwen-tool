'use client'

import {
  Box,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Heading,
  useToast
} from '@chakra-ui/react'
import {useEffect, useState} from "react";
import Web3 from 'web3'

export default function MyApp() {
  const toast = useToast()

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [oriData, setOriData] = useState('');
  const [hexData, setHexData] = useState('');
  const [customGas, setCustomGas] = useState('');
  const [count, setCount] = useState(1);
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);

  // 字符转十六进制
  function stringToHex(str){
    console.log("=>(page.js:34) str", str);
    if(!str) return
    let val= "";
    for(let i = 0; i < str.length; i++){
      val = val + str.charCodeAt(i).toString(16);
    }
    setHexData(`0x${val}`)
  }

  async function init() {
    const web3Obj = new Web3(window.ethereum);
    const accounts = await web3Obj.eth.requestAccounts()
    setAccount(accounts[0])
    setAddress(accounts[0])
    setWeb3(web3Obj)
  }

  useEffect(() =>{
    init().then()
  }, [])

  // 发送交易
  async function onBatchSend() {
    if(!window.ethereum) {
      toast({
        title: `请安装Metamask插件`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    if(!account) {
      await init()
      return
    }

    for (let i = 0; i < count; i++) {
      sendTransaction().then()
    }
  }

  async function sendTransaction() {
    try {
      const realGasPrice = await web3.eth.getGasPrice();

      const transactionObject = {
        from: account,
        to: address,
        data: hexData || undefined,
        gasPrice: customGas ? web3.utils.toWei(customGas, 'gwei') :  realGasPrice,
        value: web3.utils.toWei(amount.toString(), 'ether')
      };

      // 发送交易
      const transactionHash = await web3.eth.sendTransaction(transactionObject);
      // console.log('交易哈希：', transactionHash);
      toast({
        position: 'bottom-right',
        title: `交易成功~ ${transactionHash.blockHash}`,
        status: 'success',
        isClosable: true,
      })
    } catch (error) {
      console.error(error);
      toast.closeAll()
      toast({
        position: 'bottom-right',
        title: error.message,
        status: 'error',
        isClosable: true,
      })
    }
  }

  return (
    <Box maxW="750px" mx="auto" p={6}>
      <Heading as='h3' size="lg" textAlign="center" mb={2}> 铭文小工具 </Heading>
      <FormControl isRequired pt={2}>
        <FormLabel>转账地址</FormLabel>
        <Input type='text' placeholder="0x1234..." value={address} onChange={e => setAddress(e.target.value)} />
      </FormControl>

      <FormControl isRequired pt={2}>
        <FormLabel>转账金额</FormLabel>
        <NumberInput defaultValue={0} min={0}>
          <NumberInputField value={amount} onChange={e => setAmount(e.target.value)} placeholder="默认 0" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      {/*<FormControl pt={2}>*/}
      {/*  <FormLabel>自定义data - 原始串</FormLabel>*/}
      {/*  <Input type='text' value={oriData} onChange={e => setOriData(e.target.value)} placeholder="非必填，原始数据" onBlur={e => stringToHex(e.target.value)} />*/}
      {/*</FormControl>*/}

      <FormControl pt={2}>
        <FormLabel>自定义data</FormLabel>
        <Input type='text' value={hexData} onChange={e => setHexData(e.target.value)} placeholder="非必填，十六进制数据" />
      </FormControl>

      <FormControl pt={2}>
        <FormLabel>自定义gas</FormLabel>
        <NumberInput min={0}>
          <NumberInputField value={customGas} onChange={e => setCustomGas(e.target.value)} placeholder="非必填" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl isRequired pt={2}>
        <FormLabel>调用次数</FormLabel>
        <NumberInput min={1} defaultValue={1}>
          <NumberInputField value={count} onChange={e => setCount(e.target.value)} placeholder="默认1次" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Button mt={4} width="100%" colorScheme='blue' variant='solid' onClick={onBatchSend}>
        {account ? '发送交易' : '连接钱包'}
      </Button>
    </Box>
  )
}
