import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class AutonomousChooser extends React.Component {

    constructor(props) {
        super();
        this.change = this._change.bind(this);
    }

    _change(event) {
        let newSelected = this.props.modes.indexOf(event.target.value);
        console.log(newSelected);
        this.props.setAutonomous(newSelected);
    }

    render() {
        let panelClass = "fill-parent panel panel-default";

        return (
            <ResizableAndMovable x={20} y={20} width={300} height={150}
                                 minWidth={300} maxWidth={300}
                                 minHeight={150} maxHeight={150}>

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