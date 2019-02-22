import React from 'react'

const style = {
	marginTop: -32,
	paddingLeft: 40
}

const style1 = {
	marginTop: 100,
	paddingLeft:75
}

class ThermometerWidget extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			temperatureFromDevice: 0,
			barStyle : {
				position:'absolute',
				top: (3000 - parseInt(3000))/10 + '%' ,
				width: '100%',
				height: '100%'
			}
		}

		this.lastValue = null
	}

	static getDerivedStateFromProps(props, state){
		var mqttMessage = props.mqttMessage;
		  
  		if (mqttMessage != null && mqttMessage.destinationName === props.listenChannel ) {
  			return {
				  temperatureFromDevice: mqttMessage.payloadString,
				  barStyle : {
						position:'absolute',
						top: (3000 - parseInt(mqttMessage.payloadString))/10 + '%',
						width: '100%',
						height: '100%'
					}
				}
		} else {
			return state;
		}
	}
	
	
	render() {
		return (
			<div>
				<p style={style}>Temperature: {this.state.temperatureFromDevice} C</p>
				<div className="progress">
					<div className="progress-bar bg-primary" role="progressbar" style={this.state.barStyle} aria-valuenow="" aria-valuemin="0" aria-valuemax="3000">		
					</div>
				</div>
				<p style={style1}>{100 - parseInt(this.state.barStyle.top)} C</p>
			</div>
		);
	}
}

export default ThermometerWidget;