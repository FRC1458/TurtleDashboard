import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class DataWidget extends React.Component {

    constructor(props) {
        super();
        this.state = {
            color: "default", // default, primary, success, warning, danger, info
            title: props.name,
            resizeWidth: 350,
            resizeHeight: 300,
            resizeMinWidth: 180,
            resizeMinHeight: 150,
            numberName: props.name+"_"+Math.floor(Math.random() * 10000)
        };

        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.setDisplay = this._setDisplay.bind(this);
        this.setValue = this._setValue.bind(this);
        this.submit = this._submit.bind(this);
        this.remove = props.remove;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.kP != this.props.kP) {
            $("#"+this.state.numberName+"_kP").val(nextProps.kP);
        }

        if(nextProps.kI != this.props.kI) {
            $("#"+this.state.numberName+"_kI").val(nextProps.kI);
        }

        if(nextProps.kD != this.props.kD) {
            $("#"+this.state.numberName+"_kD").val(nextProps.kD);
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

    _submit(event) {
        let kP = parseFloat($("#"+this.state.numberName+"_kP").val());
        let kI = parseFloat($("#"+this.state.numberName+"_kI").val());
        let kD = parseFloat($("#"+this.state.numberName+"_kD").val());
        console.log(kP + " -- "+kI + " -- "+kD);

        if(isNumber(kP) && isNumber(kI) && isNumber(kD)) {
            $.get(`/putNumber?key=${escape(this.props.name+"_PID_kP")}&value=${escape(kP+"")}`);
            $.get(`/putNumber?key=${escape(this.props.name+"_PID_kI")}&value=${escape(kI+"")}`);
            $.get(`/putNumber?key=${escape(this.props.name+"_PID_kD")}&value=${escape(kD+"")}`);
        }
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

                                </ul>
                            </div>
                        </h1>


                    </div>

                    <div className="panel-body">

                        <form className="form-horizontal">
                            <div className="form-group">
                                <label for="inputEmail3" className="col-sm-2 control-label">kP</label>
                                <div className="col-sm-10">
                                    <input className="form-control" id={this.state.numberName+"_kP"} defaultValue={this.props.kP}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="inputEmail3" className="col-sm-2 control-label">kI</label>
                                <div className="col-sm-10">
                                    <input className="form-control" id={this.state.numberName+"_kI"} defaultValue={this.props.kI} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label for="inputEmail3" className="col-sm-2 control-label">kD</label>
                                <div className="col-sm-10">
                                    <input className="form-control" id={this.state.numberName+"_kD"} defaultValue={this.props.kD} />
                                </div>
                            </div>
                        </form>
                        <button type="button" onClick={this.submit} className="btn btn-primary" style={{"width": "100%"}}>Submit</button>

                        {/*<div className="input-group input-group-sm">
                            <span className="input-group-addon" style={{"fontSize": "25px"}}>kP</span>
                            <input name={this.props.name} onChange={this.setValue}
                                   className="form-control input-sm" type="text"
                                   style={{"fontSize": "35px", "height": "100%"}}
                                   defaultValue={this.props.val}/>
                        </div>

                        <div className="input-group input-group-sm">
                            <span className="input-group-addon" style={{"fontSize": "25px"}}>kI</span>
                            <input name={this.props.name} onChange={this.setValue}
                                   className="form-control input-sm" type="text"
                                   style={{"fontSize": "35px", "height": "100%"}}
                                   defaultValue={this.props.val}/>
                        </div>

                        <div className="input-group input-group-sm">
                            <span className="input-group-addon" style={{"fontSize": "25px"}}>kD</span>
                            <input name={this.props.name} onChange={this.setValue}
                                   className="form-control input-sm" type="text"
                                   style={{"fontSize": "35px", "height": "100%"}}
                                   defaultValue={this.props.val}/>
                        </div>*/}
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