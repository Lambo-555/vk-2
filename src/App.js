import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import {AdaptivityProvider, AppRoot} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from './panels/Main';
import BitLight from './panels/BitLight';


const App = () => {
  const [activePanel, setActivePanel] = useState("Main");
  const [popout, setPopout] = useState(null && <ScreenSpinner size='large'/> || null);

  useEffect(() => {
    bridge.subscribe(({detail: {type, data}}) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
  }, []);

  const go = (e) => {
    setActivePanel(e.currentTarget.dataset.to);
  };

  return (
      <AdaptivityProvider>
        <AppRoot>
          <View activePanel={"BitLight" || activePanel} popout={popout}>
            {/*//TODO delete activePanel*/}
            <Main id='Main' go={go} setPopout={setPopout}/>
            {/*<FriendList id='FriendList' go={go}/>*/}
            <BitLight id='BitLight' go={go}/>
            {/*<Labirinth id='FriendList' go={go}/>*/}
          </View>
        </AppRoot>
      </AdaptivityProvider>
  );
};

export default App;
