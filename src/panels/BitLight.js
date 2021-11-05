import React, {useState} from 'react';
import {Panel, PanelHeader, PanelHeaderBack, Group, Header, Div, Button, IconButton, Headline} from "@vkontakte/vkui";
import {Icon28VinylOutline, Icon16Add, Icon16Cancel, Icon28Play, Icon24Stop} from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";
import {useEffect} from "react";

const BitLight = props => {
  const [bpsList, setBpsList] = useState([]);
  const [bps, setBps] = useState([false, false, false, false, false, false, false, false]);
  const [user, setUser] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);

  const getBpsList = async () => {
    try {
      // get list axios
      setBpsList([]);
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
    bridge.send("VKWebAppFlashGetInfo")
        .then(lightData => {
          console.log('lightData', lightData);
          if(!lightData.is_available) {}//modal
        })
        .catch(err => console.log(err));
    setPlayStatus(true);

    for(signal of bps) {
      if(signal) {
        Math.round(new Date() / 1000)
      }
    }

    bridge.send("VKWebAppFlashSetLevel", {"level": 1})
        .then(flashData => console.log(flashData))
        .catch(error => console.log(error));
  };

  const bitHandler = (e) => {
    let bits = [...bps];
    let bit = e.currentTarget.dataset.id;
    bits[bit] = !bits[bit];
    console.log('bits[bit]', bits[bit]);
    setBps(bits);
    console.log(bits);
  };

  return (
      <Panel id={props.id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={props.go} data-to="Main"/>}
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
          <Header mode="secondary" indicator={user && "id" + user.id + Date.now()}>Создать свой BPS</Header>
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
                before={!playStatus ? <Icon28Play/> : <Icon24Stop/>}
                mode="outline"
                size="l"
                onClick={() => playHandler()}
                stretched
                style={{marginRight: 0}}
            >Воспроизвести</Button>
          </Div>
          <Div style={{display: 'flex'}}>
            <Button before={<Icon28VinylOutline/>} size="l" stretched style={{marginRight: 0}}>Создать</Button>
          </Div>
        </Group>
        <Group>
          <Header mode="secondary" indicator={bpsList ? bpsList.length : 0}>Список сторонних BPS</Header>
        </Group>
      </Panel>
  );
};

export default BitLight;
