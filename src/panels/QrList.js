import React from 'react';
import {Panel, PanelHeader, PanelHeaderBack, Group, List, Cell, Header, SimpleCell, Link} from "@vkontakte/vkui";
import {useState, useEffect} from "react";
import { Icon28InfoOutline } from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";

const QrList = props => {
  const [qrList, setQrList] = useState([]);
  const getCount = async () => {
    try {
      const storageKeys = await bridge.send("VKWebAppStorageGetKeys", {"count": 1000, "offset": 0});
      const storageValues = await bridge.send("VKWebAppStorageGet", {"keys": storageKeys.keys});
      let keysToRender = storageValues.keys.map(item => item.value);
      setQrList(Array.from(new Set(keysToRender)))
    } catch (error) {
      console.log('QrCount ERROR', error.message);
    }
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
      <Panel id={props.id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={props.go} data-to={"QrMain"}/>}
        >
          Лист QR-кодов
        </PanelHeader>
        <Group>
          <List>
            <Group header={<Header mode="secondary">Лист QR-кодов</Header>}>
              {qrList.length === 0 && <SimpleCell before={<Icon28InfoOutline />}>Пусто</SimpleCell>}
              {qrList.length > 0 &&
              <List>
                {qrList && qrList.map(item => (
                    <Cell key={item} onRemove={() => setQrList(qrList.filter(button => button !== item))}>
                      <Link href={item}>{item}</Link></Cell>
                ))}
              </List>
              }
            </Group>
          </List>
        </Group>
      </Panel>
  )
};

export default QrList;
