import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import {AdaptivityProvider, AppRoot} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Main from './panels/Main';
import BitLight from './panels/BitLight';
import Giroscope from './panels/Giroscope';
import Menu from './panels/Menu';


const App = () => {
  const [activePanel, setActivePanel] = useState("Menu");
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
          <View activePanel={activePanel} popout={popout}>
            <Menu id='Menu' go={go}/>
            <Main id='Main' go={go} setPopout={setPopout}/>
            {/*<FriendList id='FriendList' go={go}/>*/}
            <BitLight id='BitLight' go={go}/>
            <Giroscope id='Giroscope' go={go}/>
            {/*<Labirinth id='FriendList' go={go}/>*/}
          </View>
        </AppRoot>
      </AdaptivityProvider>
  );
};

export default App;


// env MINI_APPS_ACCESS_TOKEN=a9ef802e4579bd8fb3b1ced259843b53706a98c48d02eef96ba24429323ffa5924dc0cba6c2a6cf36c8c5 yarn deploy
