import React from "react";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'

// To include the default styles
import 'react-rangeslider/lib/index.css'


class ValueSenderWidget extends React.Component {
  constructor(props) {
    super(props);

    this.listenAtChanges = true;
    this.state = {
      barSeekValue: 0,
      barshow : {
        width : '100%'
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }



  handleChange(value) {
    this.setState({ 
      barSeekValue: value,
      barshow: { 
        width : (value * 5) + 'px'
      }
    });
    ValueSenderWidget.postValueToDevice(
      value,
      this.props.mqttClient,
      this.props.publishChannel
    );
  }

  handleMouseDown(event) {
    this.listenAtChanges = false;
  }

  handleMouseUp(event) {

    this.listenAtChanges = true;
    console.log(event.target.value);
    
  }

  render() {
    return (
      <div >
        <span className="sender-value"> {parseInt(this.state.barSeekValue)} % </span>
        

        <Slider
          min={0}
          max={100}
          value={this.state.barSeekValue}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  static postValueToDevice(newValue, mqttClient, channel) {
    if (mqttClient == null) {
      console.log("client is null");
      return;
    }
    if (!mqttClient.isConnected()) {
      console.log("client not connected");
      return;
    }
    var message;
    message = new window.Paho.MQTT.Message(newValue + "");
    message.destinationName = channel;
    mqttClient.send(message);
    console.log("published event with value " + newValue);
  }

  static getMostRecentValueFromDevice(mqttMessage, listenChannel) {
    if (mqttMessage == null) {
      console.log("mqttMessage is null");
      return;
    }
    if (
      mqttMessage.destinationName !== listenChannel ||
      mqttMessage.payloadString == null
    ) {
      console.log("invalid message");
      return;
    }

    var valueFromDevice = (mqttMessage.payloadString * 100) / 255;
    console.log("value from device is " + valueFromDevice);
    return valueFromDevice;
  }

  static getDerivedStateFromProps(props, state) {
    const lastValueFromDevice = ValueSenderWidget.getMostRecentValueFromDevice(
      props.mqttMessage,
      props.listenChannel
    );
    if (lastValueFromDevice == null) {
      //console.log(state);
      return state;
    } else {
      return { barSeekValue: lastValueFromDevice };
    }
  }
}

export default ValueSenderWidget;
