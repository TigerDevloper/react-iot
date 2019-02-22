import React, { Component } from 'react';
//import logo from './logo.svg';
import LedWidget from './components/LedWidget.js'
import ThermometerWidget from './components/ThermometerWidget.js'
import TemperatureGraphWidget from './components/TemperatureGraphWidget.js'
import SwitchWidget from './components/SwitchWidget.js'
import ValueSenderWidget from './components/ValueSenderWidget.js'

//import './IoTApp.css';
const style = {
  textAlign: "center"
};

const style1 = {
  marginRight: 10
}

const style2 = {
  padding: 30
}

const style3 = {
  marginTop: -32,
  paddingLeft: 40
}

class IoTApp extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			mqttMessage: null,
			mqttClient: null,
			valueMessage: null
		}

		this.clickFunc = this.clickFunc.bind(this);
	}
	
	componentDidMount(){
		const component = this;
		var client = new window.Paho.MQTT.Client(
			"m15.cloudmqtt.com", 
			30740,
			"web_" + parseInt(Math.random() * 100, 10));
		var options = {
    		useSSL: true,
    		userName: "hxkuvxve",
    		password: "IFBuiiYDfc4m",
    		onSuccess:function() {
    			console.log("connected")
    			client.subscribe("/broadcast/pushButton")
    			client.subscribe("/broadcast/temperature")
    			client.subscribe("/broadcast/switch")
    			client.subscribe("/broadcast/intensityValue")
    			console.log("will set state " + client)
    			component.setState({
    				mqttClient: client
    			});
    		},
    		onFailure:function() {
    			console.log("conection fail")
    		}
  		}

		client.onConnectionLost = function(responseObject){
			if (responseObject.errorCode !== 0) {
    			console.log("onConnectionLost:"+responseObject.errorMessage);
  			}
		};
  		client.onMessageArrived = function(msg) {
  			console.log("arrived: " + msg.destinationName + "->" + msg.payloadString);
  			component.setState({
  				mqttMessage: msg
  			});
  			/*
  			if (msg.destinationName == "/broadcast/intensityValue") {
  				component.setState({
  					valueMessage: msg.payloadString
  				});
  			}*/
  		};
  	
  		// connect the client
		client.connect(options);

	}

	clickFunc() {
		this.led1.publicMethod()
	}
	
  render() {
  	//console.log("render main app")
    return (
      
		<div className="container">
        <header style={style} id="header">
          <div>
            {/* <img id="logo1" src="../img/logo-1.png" /> */}
            <h2>MIGHTY CONTROLLER</h2>
            {/* <img id="logo2" src="../img/logo-A-T.png" /> */}
          </div>
        </header>
        <div id="appContent">
          <div className="container" >
            <h3> Device Control </h3>
            <div className="row" id="devicecontrol">
              <div className="col-sm-6" style={style2}>
                <ion-icon id="power1" name="power" style={style1} />
                <p style={style3}>Switch</p>
                <SwitchWidget
                  publishChannel="/command/switch"
                  listenChannel="/broadcast/switch"
                  mqttMessage={this.state.mqttMessage}
                  mqttClient={this.state.mqttClient}
                />
              </div>
              <div className="col-sm-6" style={style2}>
                <ion-icon id="speedometer1" name="speedometer" style={style1}  />
                <p style={style3}>Sender Value</p>
                <ValueSenderWidget
                  publishChannel="/command/intensityValue"
                  listenChannel="/broadcast/intensityValue"
                  mqttMessage={this.state.mqttMessage}
                  mqttClient={this.state.mqttClient}
                />
              </div>
            </div>
          </div>
          <div className="container">
            <h3> Device Status </h3>
            <div className="row" id="devicestatus">
              <div className="col-sm-3" style={style2}>
                <ion-icon id="power2" name="power" />
                <p style={style3}>Switch Status</p>
                <LedWidget
                  listenChannel="/broadcast/pushButton"
                  mqttMessage={this.state.mqttMessage}
                />
              </div>
              <div className="col-sm-3" style={style2}>
                <ion-icon id="snow1" name="snow" />
                <ThermometerWidget
                  mqttMessage={this.state.mqttMessage}
                  listenChannel="/broadcast/temperature"
                />
              </div>
              <div className="col-sm-6" style={style2}>
                <ion-icon id="podium1" name="podium" style={style1} />
                <p style={style3}>Variation</p>
                <TemperatureGraphWidget />
              </div>

            </div>
          </div>
        </div>
      </div>

			
    );
  }
}

export default IoTApp;