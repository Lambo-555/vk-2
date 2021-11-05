import React, {useState} from 'react';
import {Panel, PanelHeader, PanelHeaderBack, Group, Header} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import {useEffect} from "react";

const QrCount = props => {
  const [qrCount, setQrCount] = useState();
  const getCount = async () => {
    try {
      const storageVk = await bridge.send("VKWebAppStorageGetKeys", {"count": 1000, "offset": 0});
      setQrCount(storageVk.keys.length);
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
            left={<PanelHeaderBack onClick={props.go} data-to="QrMain"/>}
        >
          Количество QR-кодов
        </PanelHeader>
        <Group>
          <Header mode="secondary" indicator={qrCount ? qrCount : 0}>Количество отсканированных QR кодов</Header>
        </Group>
      </Panel>
  );
};

export default QrCount;
