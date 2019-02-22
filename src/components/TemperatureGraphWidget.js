import React from 'react'

const style = {
	height: 200,
	width: 450
};
class TemperatureGraphWidget extends React.Component {
	componentDidMount() {
		//this.props.onRef(this)
	}

	componentWillUnmount() {
		//this.props.onRef(undefined)
	}
	
	publicMethod() {
		alert("child method");
	}
	
	render() {
		return (
			<div id="chartContainer" style={style}></div>
		)
	}
}

export default TemperatureGraphWidget;