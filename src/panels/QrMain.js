import React from 'react';
import {Panel, PanelHeader, Button, Div, Group, Cell, Link, Header, Headline, Alert, SimpleCell} from "@vkontakte/vkui";
import {
  Icon28ListOutline,
  Icon28CubeBoxOutline,
  Icon28StoryAddOutline,
  Icon28QrCodeOutline
} from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge";

const QrMain = props => {
  const onStiker = () => {
    bridge.send(
        "VKWebAppShowStoryBox",
        {
          "background_type": "image",
          "url": "https://cdn.pixabay.com/photo/2016/08/28/18/28/star-1626550_960_720.jpg",
          "attachment": {
            "text": "Просто космос сканер QR-кодов",
            "type": "url",
            "url": "https://vk.com/app7993121",
          },
          "stickers": [
            {
              "sticker_type": "renderable",
              "sticker": {
                "content_type": "image",
                "url": "https://cdn.pixabay.com/photo/2016/04/02/21/01/earth-1303628_960_720.png",
                "transform": {
                  "rotation": Math.floor(Math.random() * 359),
                  "translation_x": Math.random() * .25,
                  "translation_y": Math.random() * .25,
                  "relation_width": Math.random() * .25,
                },
                "clickable_zones": [
                  {
                    "action_type": "app",
                    "action_app": {
                      "app_id": "7993121",
                    },
                    "clickable_area": [
                      {
                        "x": 0,
                        "y": 0,
                      },
                      {
                        "x": 0,
                        "y": 100,
                      },
                      {
                        "x": 100,
                        "y": 100,
                      },
                      {
                        "x": 100,
                        "y": 0,
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
    )
        .then(data => console.log(data))
        .catch(error => console.log(error))
  };

  const onScan = () => {
    bridge.send("VKWebAppOpenCodeReader")
        .then(reader => {
          let validLink = reader.code_data;
          bridge.send("VKWebAppCallAPIMethod",
              {
                "method": "utils.checkLink",
                "params": {
                  "url": validLink,
                  "access_token": "bd1687a8bd1687a8bd1687a89bbd6f7089bbd16bd1687a8dc9284b62d1339845a7cbe2d"
                }
              })
              .then(data => {
                if (data.response.status === 'not_banned') {
                  console.log(data.response.status);
                  bridge.send("VKWebAppStorageSet", {
                    "key": reader.code_data.replace(/[^\w@-]/g, ''),
                    "value": ` ${reader.code_data} `
                  })
                      .then(data => {
                        props.setPopout(
                            <Alert
                                actions={[{
                                  title: 'Отлично!',
                                  mode: 'cancel',
                                  action: () => props.setPopout(null),
                                }]}
                                actionsLayout="vertical"
                                onClose={props.setPopout(null)}
                                header="QR-код отсканирован"
                                text="Вы можете найти его в списке QR-кодов"
                            />);
                        console.log(data);
                      })
                      .catch(error => console.log("storage set RESULT: ", error));
                }
              })
              .catch(error => {
                props.setPopout(
                    <Alert
                        actions={[{
                          title: 'Ладненько...',
                          mode: 'cancel',
                          action: () => props.setPopout(null),
                        }]}
                        actionsLayout="vertical"
                        onClose={props.setPopout(null)}
                        header="QR-код не валиден"
                        text="К сожалению QR код не хороший, мы не станем его добавлять к вам в список, он может навредить или просто бесполезно лежать на сервере"
                    />);
                console.log(error);
              });
        })
        .catch(error => console.log(error));
  };

  return (
      <Panel id={props.id}>
        <PanelHeader>Space QR-сканер</PanelHeader>

        <Group>
          <Div>
            <Headline weight="regular">Приложение сканирует QR-коды. Ссылки валидируются
              через VK API <i>(utils.checkLink). В сторисах вы смотрите на землю, как космонавт, с разных сторон и на разной дистанции!</i></Headline>
          </Div>
        </Group>

        <Div style={{display: 'flex', height: "20vh"}}>
          <Button
              onClick={() => onScan()}
              before={<Icon28QrCodeOutline/>}
              stretched size="l"
          >Сканировать QR-код</Button>
        </Div>

        <Group header={<Header mode="secondary">Меню</Header>}>
          <Cell before={<Icon28ListOutline/>} onClick={props.go} data-to={"QrList"}>
            Лист QR-кодов
          </Cell>
          <Cell before={<Icon28CubeBoxOutline/>} onClick={props.go} data-to={"QrCount"}>
            Количество QR-кодов
          </Cell>
        </Group>

        <Group header={<Header mode="secondary">Поделиться</Header>}>
          <Div>
            <Button
                onClick={() => onStiker()}
                before={<Icon28StoryAddOutline/>}
                size="l"
                stretched
            >Создать историю</Button>
          </Div>
        </Group>

        <Group>
          <Header mode="secondary">Разработчик</Header>
          <SimpleCell>Хакатонец <Link href="https://vk.com/nevermoredmb">Станислав (Ребята)</Link></SimpleCell>
        </Group>

      </Panel>
  )
};


export default QrMain;
