import React from 'react';
import {Panel, PanelHeader, PanelHeaderBack} from "@vkontakte/vkui";

const QrShot = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
		>
      QrShot
		</PanelHeader>
	</Panel>
);

export default QrShot;
