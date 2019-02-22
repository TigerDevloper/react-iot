import React from 'react'

class LedWidget extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			lastValue: false
		}
	}

	static getDerivedStateFromProps(props, state){
		var mqttMessage = props.mqttMessage
		var valueDefined;
		if (mqttMessage != null && mqttMessage.destinationName === props.listenChannel ) {
			if (props.mqttMessage.payloadString === "true") {
				valueDefined = true;
			} else {
				valueDefined = false	
			}
		} else {
			valueDefined = state.lastValue
		}
		return {
			lastValue: valueDefined
		}	
	}

	
	render() {
		const statusElement = this.state.lastValue ? <p>Encendido</p> : <p>Apagado</p>
		return (
			<div id="switchon_off">
				<h1>{statusElement}</h1>
			</div>	
		);
	}
}

export default LedWidget;