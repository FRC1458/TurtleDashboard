import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class AutonomousChooser extends React.Component {

    constructor(props) {
        super();
        this.change = this._change.bind(this);
        this.state = {
            x: props.x || 20,
            y: props.y || 20,
            width: props.width || 300,
            height: props.height || 150
        };
        this.drag = this._drag.bind(this);
        this.resize = this._resize.bind(this);
    }

    _change(event) {
        let newSelected = this.props.modes.indexOf(event.target.value);
        console.log(newSelected);
        this.props.setAutonomous(newSelected);
    }

    _drag(event, data) {
        let newState = Object.assign({}, this.state, {x: data.position.left, y: data.position.top});
        this.setState(newState);
    }

    _resize(data) {
        let newState = Object.assign({}, this.state, {width: data.width, height: data.height});
        this.setState(newState);
    }

    render() {
        let panelClass = "fill-parent panel panel-default";

        return (
            <ResizableAndMovable x={this.state.x} y={this.state.y} width={this.state.width} height={this.state.height}
                                 minWidth={300} maxWidth={300}
                                 minHeight={150} maxHeight={150}
                                 onResizeStop={this.resize} onDragStop={this.drag}>

                <div className={panelClass}>
                    <div className="panel-heading">
                        <h1 className="panel-title">
                            Autonomous
                        </h1>


                    </div>

                    <div className="panel-body">
                        <select className="form-control fill-parent input-lg" onChange={this.change}>
                            {this.props.modes.map((mode) => {
                                if (mode === this.props.modes[this.props.selected]){
                                    return (
                                        <option selected>{mode}</option>
                                    );
                                } else {
                                    return (
                                        <option>{mode}</option>
                                    );
                                }
                                //console.log(this.addChild);
                            })}
                        </select>
                    </div>
                </div>
            </ResizableAndMovable>
        );
    }
}

export default AutonomousChooser;