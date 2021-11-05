import React, {useState} from 'react';
import {Panel, PanelHeader, PanelHeaderBack, Div, Button, Group, Header} from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import {useEffect} from "react";

const Menu = props => {
  return (
      <Panel id={props.id}>
        <PanelHeader>Menu</PanelHeader>
        <Group header={<Header mode="secondary">Типы кнопок</Header>}>
          <Div>
            <Button onClick={props.go} data-to="Main">Бесконтактное рукопожатие</Button>
          </Div>
          <Div>
            <Button onClick={props.go} data-to="BitLight">Фонарик мелодия</Button>
          </Div>
          <Div>
            <Button onClick={props.go} data-to="Giroscope">Гироскоп (WIP)</Button>
          </Div>
        </Group>
      </Panel>
  );
};

export default Menu;
