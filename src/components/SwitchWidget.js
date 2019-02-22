import React from "react";
import "../index.css";

const style = {
  marginLeft: 300
}

class SwitchWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ledStatus: false
    };
    this.handleSwitchClick = this.handleSwitchClick.bind(this);
  }

  handleSwitchClick() {
    console.log(this.state.ledStatus);
    if (this.props.mqttClient != null && this.props.mqttClient.isConnected()) {
      var message;
      if (this.state.ledStatus != null && this.state.ledStatus === true) {
        message = new window.Paho.MQTT.Message("false");
      } else {
        message = new window.Paho.MQTT.Message("true");
      }
      message.destinationName = this.props.publishChannel;
      this.props.mqttClient.send(message);
    }
    //console.log(this.state);
  }

  static getDerivedStateFromProps(props, state) {
    var mqttMessage = props.mqttMessage;

    if (
      mqttMessage != null &&
      mqttMessage.destinationName === props.listenChannel
    ) {
      if (props.mqttMessage.payloadString === "true") {
        return {
          ledStatus: true
        };
      } else {
        return {
          ledStatus: false
        };
      }
    } else {
      return state;
    }
  }

  render() {
    let content;
    if (this.state.ledStatus === false) {
      content = (
        <label className="switch" style={style}>
          <input type="checkbox" id="togBtn" />
            <div className="slider round">
              <span className="on">ON</span>
              <span className="off">OFF</span>
            </div>
        </label>
      );
    } else {
      content = (
        <button className="buttonOff" onClick={this.handleSwitchClick}>
          
          Turn Off
        </button>
      );
    }
    return (
      <div className="SwitchWidget">
         {content}
      </div>
    );
  }
}

export default SwitchWidget;
