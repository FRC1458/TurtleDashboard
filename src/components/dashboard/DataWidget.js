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
            resizeWidth: 350,
            resizeHeight: 300,
            resizeMinWidth: 180,
            resizeMinHeight: 150,
            gaugeMin: 0,
            gaugeMax: 100
        };

        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.setDisplay = this._setDisplay.bind(this);
        this.setValue = this._setValue.bind(this);
        this.remove = props.remove;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.val != this.props.val && this.state.display == "TEXTBOX") {
            $(`[name=${this.props.name}]`).val(nextProps.val);
        }
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

    _setDisplay(event) {
        let target = $(event.target);
        let display = target.attr("data-id");

        let newState = Object.assign({}, this.state, {display});

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

            newState.resizeWidth = 235;
            newState.resizeHeight = 235;

            newState.resizeMinWidth = 235;
            newState.resizeMinHeight = 235;
        } else {
            newState.resizeWidth = 350;
            newState.resizeHeight = 300;

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
            panelBody = (<span style={{"fontSize": "50px"}}>{this.props.val}</span>);
            break;

        case "TEXTBOX":
            panelBody = (<input name={this.props.name} onChange={this.setValue} className="form-control input-lg" style={{"fontSize": "50px", "width": "100%"}} defaultValue={this.props.val}/>);
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