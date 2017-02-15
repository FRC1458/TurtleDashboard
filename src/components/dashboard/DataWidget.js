import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class DataWidget extends React.Component {

    constructor(props) {
        super();
        this.state = {
            color: "default", // default, primary, success, warning, danger, info
            title: props.name,
            display: "TEXT", // TEXT, TEXTBOX, GAUGE, CHECKMARK
            isNumber: isNumber(props.val),
            isBoolean: isBoolean(props.val),
            resizeMinWidth: 180,
            resizeMinHeight: 150,
            gaugeMin: 0,
            gaugeMax: 100,
            decimalPlaces: -1,
            x: props.x || 20,
            y: props.y || 20,
            width: props.width || 350,
            height: props.height || 300
        };
        this.drag = this._drag.bind(this);
        this.resize = this._resize.bind(this);

        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.setDisplay = this._setDisplay.bind(this);
        this.setValue = this._setValue.bind(this);
        this.changeRounding = this._changeRounding.bind(this);
        this.remove = props.remove;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.val != this.props.val && this.state.display == "TEXTBOX") {
            $(`[name=${this.props.name}]`).val(nextProps.val);
        }
    }

    _drag(event, data) {
        let newState = Object.assign({}, this.state, {x: data.position.left, y: data.position.top});
        this.setState(newState);
    }

    _resize(location, data) {
        let newState = Object.assign({}, this.state, {width: data.width, height: data.height});
        this.setState(newState);
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

    _changeRounding() {
        vex.dialog.prompt({
            message: "Enter the number of decimal places to round between 0 and 20 (Enter -1 for default):",
            callback: (decimalPlaces) => {
                this.setState(Object.assign({}, this.state, {decimalPlaces}));
            }, beforeClose: function () {
                var number = $(this.rootEl).find(".vex-dialog-prompt-input").val();
                return isNumber(number) && parseFloat(number) >= -1 && parseFloat(number) <= 20;
            }
        });
    }

    _setDisplay(event) {
        let target = $(event.target);
        let display = target.attr("data-id");

        let newState = Object.assign({}, this.state, {display});

        if(display != "TEXT") {
            newState.decimalPlaces = -1;
        }

        if(display == "GAUGE") {

            vex.dialog.prompt({
                message: "Enter the minimum value for the gauge (must be a number):",
                callback: (gaugeMin) => {
                    this.setState(Object.assign({}, this.state, {gaugeMin}));

                    vex.dialog.prompt({
                        message: "Enter the maximum value for the gauge (must be a number greater than minimum):",
                        callback: (gaugeMax) => {
                            this.setState(Object.assign({}, this.state, {gaugeMax}));
                        }, beforeClose: function () {
                            let val = $(this.rootEl).find(".vex-dialog-prompt-input").val();
                            return isNumber(val) &&
                                (parseFloat(val) > parseFloat(gaugeMin));
                        }
                    });

                }, beforeClose: function () {
                    return isNumber($(this.rootEl).find(".vex-dialog-prompt-input").val());
                }
            });

            newState.width = 235;
            newState.height = 235;

            newState.resizeMinWidth = 235;
            newState.resizeMinHeight = 235;
        } else {
            newState.width = 350;
            newState.height = 300;

            newState.resizeMinWidth = 180;
            newState.resizeMinHeight = 150;
        }

        this.setState(newState);
    }

    _setValue(event) {
        let target = $(event.target);
        let value = target.val();

        if(this.state.isNumber) $.get(`/putNumber?key=${escape(this.props.name)}&value=${escape(value)}`);
        else $.get(`/putString?key=${escape(this.props.name)}&value=${escape(value)}`);
    }

    render() {
        let panelClass = "fill-parent panel panel-"+this.state.color;
        let panelBody;

        switch(this.state.display){

        case "TEXT":
            if(isNumber(this.props.val) && this.state.decimalPlaces > -1){
                panelBody = (<span style={{"fontSize": "50px"}}>{parseFloat(this.props.val).toFixed(this.state.decimalPlaces)}</span>);
            } else {
                panelBody = (<span style={{"fontSize": "50px"}}>{this.props.val}</span>);
            }
            break;

        case "TEXTBOX":
            panelBody = (<input name={this.props.name} onChange={this.setValue} className="form-control input-lg" style={{"fontSize": "50px", "width": "100%", "height": "100%"}} defaultValue={this.props.val}/>);
            break;

        case "GAUGE":
            panelBody = (<Gauge value={parseFloat(this.props.val)} width={200} height={160} label="" valueLabelStyle={{fill: "#dddddd"}} min={this.state.gaugeMin} max={this.state.gaugeMax} />);
            break;

        case "CHECKMARK": {
            let iconClass = "fa big-icon fa-" + (this.props.val === "true" ? "check-circle" : "times-circle");
            let color = (this.props.val === "true" ? "green" : "red");
            panelBody = (<i className={iconClass} style={{color}}/>);
            break;
        }

        }

        return (
            <ResizableAndMovable x={this.state.x} y={this.state.y} width={this.state.width} height={this.state.height}
                                 minWidth={this.state.resizeMinWidth}
                                 minHeight={this.state.resizeMinHeight}
                                 onResizeStop={this.resize} onDragStop={this.drag}>

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
                                    {this.state.isNumber ? (<li><a href="#" onClick={this.changeRounding}>Change Rounding</a></li>) : undefined}

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

                    <div className="panel-body">
                        {panelBody}
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