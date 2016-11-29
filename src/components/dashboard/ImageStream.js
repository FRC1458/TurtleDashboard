import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class DataWidget extends React.Component {

    constructor(props) {
        super();
        this.state = {
            color: "default", // default, primary, success, warning, danger, info
            title: props.name,
            url: props.url,
            resizeWidth: 350,
            resizeHeight: 300,
            resizeMinWidth: 180,
            resizeMinHeight: 150
        };

        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.remove = props.remove;
    }

    _rename() {
        let placeholder = this.props.name;
        vex.dialog.prompt({
            message: "Enter a new title:",
            placeholder,
            callback: (title) => {
                if(!title) title = placeholder;
                this.setState(Object.assign({}, this.state, {title}));
            }
        });
    }

    _changeColor(event) {
        let target = $(event.target);
        if(target.prop("tagName") === "SPAN") target = target.parent();
        let color = target.attr("data-id");

        console.log(color);

        this.setState(Object.assign({}, this.state, {color}));
    }

    render() {
        let cameraView = {

        };

        return (
            <ResizableAndMovable x={20} y={20} width={this.state.resizeWidth} height={this.state.resizeHeight}
                                 minWidth={this.state.resizeMinWidth}
                                 minHeight={this.state.resizeMinHeight}>

                <div className={panelClass}>
                    <div className="panel-heading">
                        <h1 className="panel-title">
                            {this.state.title}
                            <div className="btn-group pull-right">
                                <a href="#" className="pull-right btn btn-xs btn-link white-btn dropdown-toggle"
                                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                    <i className="fa fa-caret-down fa-2x" />
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a href="#" onClick={this.rename}>Rename</a></li>
                                    <li><a href="#" onClick={this.remove}>Remove</a></li>

                                    <li role="separator" className="divider"/>
                                    <li className="dropdown-header">Color</li>

                                    <li><a href="#" onClick={this.changeColor} data-id="default"><span className="text-default">Default</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="primary"><span className="text-primary">Primary</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="success"><span className="text-success">Success</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="info"><span className="text-info">Info</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="warning"><span className="text-warning">Warning</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="danger"><span className="text-danger">Danger</span></a></li>

                                    <li role="separator" className="divider"/>
                                    <li className="dropdown-header">Display</li>

                                    <li><a href="#" onClick={this.setDisplay} data-id="TEXT">Text</a></li>
                                    <li><a href="#" onClick={this.setDisplay} data-id="TEXTBOX">Textbox</a></li>
                                    {this.state.isNumber ? (<li><a href="#" onClick={this.setDisplay} data-id="GAUGE">Gauge</a></li>) : undefined}
                                    {this.state.isBoolean ? (<li><a href="#" onClick={this.setDisplay} data-id="CHECKMARK">Boolean Icon</a></li>) : undefined}

                                </ul>
                            </div>
                        </h1>


                    </div>

                    <div className="panel-body" style={cameraView}>

                    </div>
                </div>
            </ResizableAndMovable>
        );
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(b) {
    return (b.toString() == true.toString()) || (b.toString() == false.toString());
}

export default DataWidget;