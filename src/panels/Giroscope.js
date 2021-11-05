import React, {useState} from 'react';
import {Panel, PanelHeader, PanelHeaderBack, Group, Header} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import {useEffect} from "react";

const Giroscope = props => {
  return (
      <Panel id={props.id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={props.go} data-to="Menu"/>}
        >
          Giroscope
        </PanelHeader>
        <Group>
          <Header mode="secondary" indicator={1}>Количество отсканированных QR кодов</Header>
        </Group>
      </Panel>
  );
};

export default Giroscope;
