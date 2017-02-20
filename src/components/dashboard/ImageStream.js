import React from "react";
import ResizableAndMovable from "react-resizable-and-movable";
import Gauge from "react-svg-gauge";

class ImageStream extends React.Component {

    constructor(props) {
        super();
        this.state = {
            color: "default", // default, primary, success, warning, danger, info
            title: props.name,
            url: props.url,
            resizeMinWidth: 180,
            resizeMinHeight: 150,
            x: props.x || 20,
            y: props.y || 20,
            width: props.width || 320,
            height: props.height || 340
        };
        this.drag = this._drag.bind(this);
        this.resize = this._resize.bind(this);

        this.rename = this._rename.bind(this);
        this.changeColor = this._changeColor.bind(this);
        this.changeURL = this._changeURL.bind(this);

        this.refresh = this._refresh.bind(this);

        this.remove = props.remove;
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
                if (!title) title = placeholder;
                this.setState(Object.assign({}, this.state, {title}));
            }
        });
    }

    _changeURL() {
        let placeholder = this.props.url;
        vex.dialog.prompt({
            message: "Enter a new url for the stream:",
            placeholder,
            callback: (url) => {
                if (!url) url = placeholder;
                this.setState(Object.assign({}, this.state, {url}));
            }
        });
    }

    _refresh() {
        var urlBackup = this.state.url;
        this.setState(Object.assign({}, this.state, {url: "/test/stream.jpg"}));
        setTimeout(() => {
            this.setState(Object.assign({}, this.state, {url: urlBackup}));
        }, 500);
    }

    _changeColor(event) {
        let target = $(event.target);
        if (target.prop("tagName") === "SPAN") target = target.parent();
        let color = target.attr("data-id");

        console.log(color);

        this.setState(Object.assign({}, this.state, {color}));
    }

    render() {
        let panelClass = "fill-parent panel panel-" + this.state.color;

        let cameraView = {
            //backgroundImage: `url(${this.state.url})`,
            width: "100%",
            height: "80%",
            //backgroundSize: "100% 100%",
            //backgroundRepeat: "no-repeat"
            display: "block"
        };

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

                                    <i className="fa fa-caret-down fa-2x"/>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a href="#" onClick={this.rename}>Rename</a></li>
                                    <li><a href="#" onClick={this.refresh}>Refresh Stream</a></li>
                                    <li><a href="#" onClick={this.changeURL}>Change Stream URL</a></li>
                                    <li><a href="#" onClick={this.remove}>Remove</a></li>

                                    <li role="separator" className="divider"/>
                                    <li className="dropdown-header">Color</li>

                                    <li><a href="#" onClick={this.changeColor} data-id="default"><span
                                        className="text-default">Default</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="primary"><span
                                        className="text-primary">Primary</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="success"><span
                                        className="text-success">Success</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="info"><span
                                        className="text-info">Info</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="warning"><span
                                        className="text-warning">Warning</span></a></li>
                                    <li><a href="#" onClick={this.changeColor} data-id="danger"><span
                                        className="text-danger">Danger</span></a></li>
                                </ul>
                            </div>
                        </h1>


                    </div>

                    <div className="panel-body fill-parent">
                        <img style={cameraView} src={this.state.url}/>
                    </div>
                </div>
            </ResizableAndMovable>
        );
    }
}

export default ImageStream;