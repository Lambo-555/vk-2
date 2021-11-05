import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import { AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import QrMain from './panels/QrMain';
import QrList from './panels/QrList';
import QrCount from './panels/QrCount';

const App = () => {
	const [activePanel, setActivePanel] = useState("QrMain");

	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function getUserData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
    getUserData();
	}, []);

	const go = (e) => {
	  console.log(activePanel, e.currentTarget.dataset.to);
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel}  popout={popout}>
					<QrMain id='QrMain' go={go} setPopout={setPopout}/>
					<QrCount id='QrCount' go={go}/>
					<QrList id='QrList' go={go}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
};

export default App;

// go={go}

