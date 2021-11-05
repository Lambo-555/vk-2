import React, {useEffect, useState} from 'react';
import {
  Panel,
  PanelHeader,
  Button,
  Div,
  Group,
  Cell,
  Link,
  Header,
  Headline,
  Alert,
  SimpleCell,
  CardGrid,
  Card,
  RichCell,
  Avatar,
  IconButton, PanelHeaderBack,
} from "@vkontakte/vkui";
import {
  Icon28ListOutline,
  Icon28UserAddOutline,
  Icon28StoryAddOutline,
  Icon28SendOutline
} from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";
import io from "socket.io-client";
import ScreenSpinner from "../App";

const SERVER_URL = 'https://vk-3-server-90dqd05ww-lambo-555.vercel.app:3000/';

const Main = props => {
  const [friend, setFriend] = useState(null);
  const [isShake, setIsShake] = useState(false);
  const [notifStatus, setNotifStatus] = useState(false);
  const [friendIsOnline, setFriendIsOnline] = useState(false);
  const [giro, setGiro] = useState(0);

  const sendShakeHandler = () => {
    // if(!friendIsOnline) return; //modal bad but ok
    if (isShake) return; //modal - you make it
    props.setPopout(<ScreenSpinner size='large'/>);
    bridge.send("VKWebAppAllowNotifications");
    bridge.send("VKWebAppAccelerometerStart", {})
        .then(data => console.log('data', data))
        .catch(error => console.log('data', error));
    bridge.subscribe(({detail: {type, data}}) => {
      if (type === "VKWebAppAccelerometerChanged") {
        console.log('acc', data.x);
        if (
            data.x > 11 || data.x < -11 ||
            data.y > 11 || data.y < -11 ||
            data.z > 11 || data.z < -11
        ) setIsShake(true);
      }
    });
    bridge.send("VKWebAppSendToClient")
        .then(data => {
          setNotifStatus(true);
          console.log('notif', data);
          props.setPopout(null);
        })
        .catch(err => console.log('notif', err));
  };

  useEffect(() => {
    if (isShake) bridge.send("VKWebAppAccelerometerStop", {})
        .then(data => {
          console.log('shake', data);
          props.setPopout(null);
        })
        .catch(err => console.log('shake', err));
  });

  const getFriendHandler = () => {
    bridge.send("VKWebAppGetFriends", {})
        .then(data => {
          let friend = data.users[0];
          console.log(friend);
          setFriend(friend);
        })
        .catch(error => console.log(error));
  };

  useEffect(() => {

  }, []);

  return (
      <Panel id={props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={props.go} data-to="Menu"/>}>Space Hand-Shaker</PanelHeader>
        <Group>
          <Div>
            <Headline weight="regular" style={{marginBottom: 16}}>Приложение позволяет жать руку другу дистанционно.
              Выберете друга, дождитесь когда он подключется и трясите телефоны вместе</Headline>
          </Div>
        </Group>
        <Group header={<Header mode="secondary">космо-меню</Header>}>
          <Div style={{display: 'flex', height: 100 + 'px'}}>
            <Button
                before={<Icon28UserAddOutline/>}
                size="l"
                mode={"outline"}
                stretched
                onClick={() => getFriendHandler()}
            >Выбрать {friend && 'другого'} друга</Button>
          </Div>
        </Group>
        {friend &&
        <Group header={<Header mode="secondary">Бесконтактное рукопожатие с </Header>}>
          <SimpleCell
              before={<Avatar size={48} src={friend.photo_200}/>}>{friend.first_name} {friend.last_name}</SimpleCell>
          <Div style={{display: 'flex'}}>
            <Button stretched onClick={() => sendShakeHandler()}>Отправить
              уведомление {notifStatus && ' еще раз'}</Button>
            {isShake && <h1>Вы пожали руки</h1>}
          </Div>
          <Div style={{display: 'flex', justifyContent: 'center'}}>
            <Link target="_blank"
                  href={`https://vk.com/write${friend.id}`}>Написать {notifStatus && ' еще '} сообщение</Link>
          </Div>
        </Group>
        }
      </Panel>
  )
};


export default Main;
