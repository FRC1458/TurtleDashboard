import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import moment from "moment";

class ChartWidget extends React.Component {

    constructor(props) {
        super();

        let newItem = {time: 0};
        newItem[props.name] = parseFloat(parseFloat(props.val).toFixed(1));

        this.state = {
            color: "default", // default, primary, success, warning, danger, info
            title: props.name,
            data: [newItem]
        };

        this.startTime = moment().valueOf();


        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.resetData = this._resetData.bind(this);
        this.remove = props.remove;
    }

    _resetData() {
        this.startTime = moment().valueOf();

        let time = 0;

        let newItem = {time};
        newItem[this.props.name] = parseFloat(parseFloat(this.props.val).toFixed(1));

        let data = [];
        data.push(newItem);

        let newState = Object.assign({}, this.state, {data});
        this.setState(newState);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.val.toFixed(1) === this.props.val.toFixed(1)){
            return;
        }

        let time = parseFloat(parseFloat((moment().valueOf() - this.startTime) / 1000.0).toFixed(1));

        let newItem = {time};
        newItem[this.props.name] = parseFloat(parseFloat(newProps.val).toFixed(1));

        let data = Object.assign([], this.state.data);
        data.push(newItem);

        let newState = Object.assign({}, this.state, {data});
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

    render() {
        let panelClass = "fill-parent panel panel-"+this.state.color;

        return (
            <ResizableAndMovable x={20} y={20} width={400} height={250}
                                 minWidth={200} minHeight={200}>

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
                                    <li><a href="#" onClick={this.resetData}>Reset Graph</a></li>
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

                    <div className="panel-body fill-parent">
                        <ResponsiveContainer height="80%">
                            <LineChart data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey={this.props.name} stroke="yellow" isAnimationActive={false} />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="time" type="number" name="Time" unit="Time" allowDecimals={true} />
                                <YAxis />
                                <Tooltip labelStyle={{"color": "black"}} itemStyle={{"color": "black"}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </ResizableAndMovable>
        );
    }
}

export default ChartWidget;