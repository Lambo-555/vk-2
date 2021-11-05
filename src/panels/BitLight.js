import React, {useState} from 'react';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Header,
  Div,
  Button,
  IconButton,
  Headline,
  List,
  Cell
} from "@vkontakte/vkui";
import {Icon28VinylOutline, Icon16Add, Icon16Cancel, Icon28Play, Icon24Stop} from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";
import {useEffect} from "react";

const BitLight = props => {
  const [bpsList, setBpsList] = useState([{key: "id12312312", value: [1, 0, 1, 0, 1, 0, 0, 1]}]);
  const [bps, setBps] = useState([false, false, false, false, false, false, false, false]);
  const [user, setUser] = useState(null);
  const [playStatus, setPlayStatus] = useState(true);
  const [interval, setInter] = useState(null);
  const [dataToSave, setDataToSave] = useState(null);
  const [indicator, setIndicator] = useState(1);

  const getBpsList = async () => {
    try {
      let bpsFromDb = [];
      // get list axios
      const storageKeys = await bridge.send("VKWebAppStorageGetKeys", {"count": 1000, "offset": 0});
      const storageValues = await bridge.send("VKWebAppStorageGet", {"keys": storageKeys.keys});
      let keysToRender = storageValues.keys.map(item => {
        return {key: item.key, value: item.value}
      });

      setBpsList([...bpsList, ...keysToRender]);
      console.log('BPSawdawdaw', bpsList);
    } catch (error) {
      console.log('QrCount ERROR', error.message);
    }
  };

  useEffect(() => {
    bridge.send("VKWebAppGetUserInfo")
        .then(user => {
          console.log(user);
          setUser(user);
        })
        .catch(error => console.log(error));
    getBpsList();
  }, []);

  const playHandler = () => {
    console.log('playHandler playStatus', playStatus);
    if (!playStatus) {
      clearInterval(interval);
      setInter(null);
    }

    console.log('playStatus awdawdaw', playStatus);
    bridge.send('VKWebAppFlashGetInfo')
        .then(flashData => console.log(flashData))
        .catch(error => console.log(error));

    if (!interval) {
      console.log('playStatus interval', playStatus);
      let inter = setInterval(() => {
        if (playStatus) {
          let secondNow = Math.round(new Date() / 1000) % 8;
          console.log('secondNow', secondNow, bps[secondNow]);
          bridge.send("VKWebAppFlashSetLevel", {"level": bps[secondNow] ? 1 : 0})
              .then(flashData => console.log(flashData))
              .catch(error => console.log(error));
        }
      }, 500);
      setInter(inter);
    }
  };

  const bitHandler = (e) => {
    let bits = [...bps];
    let bit = e.currentTarget.dataset.id;
    bits[bit] = !bits[bit];
    console.log('bits[bit]', bits[bit]);
    setBps(bits);
    console.log(bits);
  };

  useEffect(() => {
    setIndicator(user && "id" + user.id + Date.now());
  }, [dataToSave]);

  const saveBpsHandler = () => {
    const data = {
      "key": indicator,
      "value": JSON.stringify(bps),
    };
    setDataToSave(data);
    console.log('save', data);
    bridge.send("VKWebAppStorageSet", data)
        .then(saved => console.log('SAVED', saved))
        .catch(error => console.log('SAVED ERROR', error))
  };

  return (
      <Panel id={props.id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={props.go} data-to="Menu"/>}
        >
          Space-light BitsPerSecond
        </PanelHeader>
        <Group>
          <Div>
            <Headline weight="regular" style={{marginBottom: 16}}>Выберете совместную схему для световой дискотеки или
              создайте свою собственную!</Headline>
          </Div>
        </Group>
        <Group>
          <Header mode="secondary" indicator={indicator}>Создать свой BPS</Header>
          <Div style={{display: 'flex', justifyContent: "center", height: '55px'}}>
            <IconButton style={{margin: '-4px'}} data-id={0} onClick={(e) => bitHandler(e)}>
              {!bps[0] ? <Icon16Add/> : <Icon16Cancel/>}1s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={1} onClick={(e) => bitHandler(e)}>
              {!bps[1] ? <Icon16Add/> : <Icon16Cancel/>}2s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={2} onClick={(e) => bitHandler(e)}>
              {!bps[2] ? <Icon16Add/> : <Icon16Cancel/>}3s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={3} onClick={(e) => bitHandler(e)}>
              {!bps[3] ? <Icon16Add/> : <Icon16Cancel/>}4s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={4} onClick={(e) => bitHandler(e)}>
              {!bps[4] ? <Icon16Add/> : <Icon16Cancel/>}5s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={5} onClick={(e) => bitHandler(e)}>
              {!bps[5] ? <Icon16Add/> : <Icon16Cancel/>}6s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={6} onClick={(e) => bitHandler(e)}>
              {!bps[6] ? <Icon16Add/> : <Icon16Cancel/>}7s</IconButton>
            <IconButton style={{margin: '-4px'}} data-id={7} onClick={(e) => bitHandler(e)}>
              {!bps[7] ? <Icon16Add/> : <Icon16Cancel/>}8s</IconButton>
          </Div>
          <Div style={{display: 'flex'}}>
            <Button
                before={playStatus ? <Icon28Play/> : <Icon24Stop/>}
                mode="outline"
                size="l"
                onClick={() => {
                  setPlayStatus(!playStatus);
                  playHandler();
                }}
                stretched
                style={{marginRight: 0}}
            >{!playStatus ? 'Остановить' : 'Воспроизвести'}</Button>
          </Div>
          <Div style={{display: 'flex'}}>
            <Button
                before={<Icon28VinylOutline/>}
                size="l"
                onClick={() => saveBpsHandler()}
                stretched style={{marginRight: 0}
            }>Создать</Button>
          </Div>
        </Group>
        <Group>
          <Header mode="secondary" indicator={bpsList ? bpsList.length : 0}>Список сторонних BPS</Header>
          <List>
            {bpsList && bpsList.map((item, index) => {
                  return <Cell key={index} onClick={() => setBps(item.value)} before={<Icon16Add/>}>{item.key}</Cell>
                }
            )
            }
          </List>
        </Group>
      </Panel>
  );
};

export default BitLight;
