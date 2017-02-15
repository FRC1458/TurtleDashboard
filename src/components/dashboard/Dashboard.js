import React from "react";
import BrownOutModal from "../BrownOutModal.js";
import DataWidget from "./DataWidget.js";
import ChartWidget from "./ChartWidget.js";
import ImageStream from "./ImageStream.js";
import AutonomousChooser from "./AutonomousChooser.js";
import PidWidget from "./PidWidget.js";

import ComponentTree from "react-component-tree";
import _ from "underscore";

// TODO Set Battery Icons
// Placeholder Data
const BATTERY_1 = 12;
const BATTERY_2 = 13;
const BATTERY_3 = 14;
const BATTERY_4 = 15;

const EXCLUDED = ["Alliance", "Location", "RobotState", "Time", "BrownOut", "SelectedAutoMode", "AutoModes"];

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        // state.childrenSet.type can be DATA or CHART
        this.state = {Alliance: "BLUE", Location: 1, RobotState: "DISABLED",
            Time: 165.0, Battery: 0.0, BrownOut: false, keys: [], childrenSet: [{id: 0, index: "Battery", name: "Battery", type: "CHART"}, {id: 1, name: "Front Camera", url: "/test/stream.jpg", type: "IMAGE"}], currentId: 1};

        /*this.state = {Alliance: "BLUE", Location: 1, RobotState: "DISABLED",
            Time: 165.0, Battery: 0.0, BrownOut: false, keys: [], childrenSet: []};
           */
        /*io.on("update", (obj) => {
            //console.log(obj);

            // Reassign the state into new object
            let objKeys = Object.keys(obj);
            let newKeys = Object.assign([], this.state.keys, objKeys);
            //console.log(newKeys);

            let s = Object.assign({}, this.state);
            s.keys = newKeys;

            for(var i = 0; i < objKeys.length; i++) {
                let key = objKeys[i];
                s[key] = obj[key];
            }

            // Handle brown-out issues
            if(obj.BrownOut == true){
                $("#brownOutModal").modal("show");
            } else {
                $("#brownOutModal").modal("hide");
            }

            // If state changes, play audio
            if(obj.RobotState !== this.state.RobotState) {
                let filename = "/audio/Robot_"+obj.RobotState+".mp3";
                new Audio(filename).play();
            }

            //console.log(s);

            this.setState(s);
        });*/

        setInterval(() => {
            $.get("/api", (objString) => {
                try {
                    var obj = JSON.parse(objString);
                } catch (e) {
                    return;
                }

                //console.log(obj);

                // Reassign the state into new object
                let objKeys = Object.keys(obj);
                let newKeys = Object.assign([], this.state.keys, objKeys);
                //console.log(newKeys);

                let s = Object.assign({}, this.state);
                s.keys = newKeys;

                for(var i = 0; i < objKeys.length; i++) {
                    let key = objKeys[i];
                    s[key] = obj[key];
                }

                // Handle brown-out issues
                if(obj.BrownOut == true){
                    $("#brownOutModal").modal("show");
                } else {
                    $("#brownOutModal").modal("hide");
                }

                // If state changes, play audio
                if(obj.RobotState !== this.state.RobotState) {
                    let filename = "/audio/Robot_"+obj.RobotState+".mp3";
                    new Audio(filename).play();
                }

                //console.log(s);

                this.setState(s);
            });
        }, 100);

        this.addChild = this._addChild.bind(this);
        this.addPID = this._addPID.bind(this);
        this.addChildGraph = this._addChildGraph.bind(this);
        this.addChildImage = this._addChildImage.bind(this);
        this.save = this._save.bind(this);
        this.setAutonomous = this._setAutonomous.bind(this);
    }

    _addChild(event){
        console.log("add");
        let target = $(event.target);
        let key = target.attr("data-id");
        console.log(key);

        let childrenSet = Object.assign([], this.state.childrenSet);
        childrenSet.push({id: this.state.currentId, index: key, name: key, type: "DATA"});
        //childrenSet.push((<DataWidget val={this.state[key].toString()} name={key}/>));

        console.log(childrenSet);

        this.setState(Object.assign({}, this.state, {childrenSet, currentId: this.state.currentId + 1}));
    }

    _addPID(event){
        console.log("add");
        let target = $(event.target);
        let key = target.attr("data-id");
        console.log(key);

        let childrenSet = Object.assign([], this.state.childrenSet);
        childrenSet.push({id: this.state.currentId, index: key.replace("_PID_DEF", ""), name: key.replace("_PID_DEF", ""), type: "PID"});
        //childrenSet.push((<DataWidget val={this.state[key].toString()} name={key}/>));

        console.log(childrenSet);

        this.setState(Object.assign({}, this.state, {childrenSet, currentId: this.state.currentId + 1}));
    }

    _addChildGraph(event){
        console.log("add");
        let target = $(event.target);
        let key = target.attr("data-id");
        console.log(key);

        let childrenSet = Object.assign([], this.state.childrenSet);
        childrenSet.push({id: this.state.currentId, index: key, name: key, type: "CHART"});

        console.log(childrenSet);

        this.setState(Object.assign({}, this.state, {childrenSet, currentId: this.state.currentId + 1}));
    }

    _addChildImage(){

        vex.dialog.prompt({
            message: "Enter a url for the image stream:",
            callback: (url) => {
                let childrenSet = Object.assign([], this.state.childrenSet);
                childrenSet.push({id: this.state.currentId, name: "Camera", type: "IMAGE", url});

                this.setState(Object.assign({}, this.state, {childrenSet, currentId: this.state.currentId + 1}));

            }, beforeClose: function () {
                return $(this.rootEl).find(".vex-dialog-prompt-input").val() !== "";
            }
        });
    }

    _save(){
        let data = ComponentTree.serialize(this);
        console.log(JSON.stringify(data));
        for(var i = 0; i < data.state.childrenSet.length; i++) {
            data.state.childrenSet[i].x = data.state.children[""+i].x;
            data.state.childrenSet[i].y = data.state.children[""+i].y;
            data.state.childrenSet[i].height = data.state.children[""+i].height;
            data.state.childrenSet[i].width = data.state.children[""+i].width;
        }
        alert(JSON.stringify(data.state.childrenSet));
    }

    getRemove(id){
        return this._remove.bind(this, id);
    }

    _remove(id){
        let childrenSet = Object.assign([], this.state.childrenSet);
        let index = _.findIndex(childrenSet, {id});
        if(index === -1) return;
        childrenSet[index].type = "NONE";

        this.setState(Object.assign({}, this.state, {childrenSet}));
    }

    _setAutonomous(SelectedAutoMode){
        //io.emit("setAutonomous", SelectedAutoMode);
        $.get("/setAutonomous?autoMode="+parseInt(SelectedAutoMode));
        this.setState(Object.assign({}, this.state, {SelectedAutoMode}));
    }

    render() {
        let navClass = "navbar navbar-" + (this.state.Alliance === "RED" ? "inverse" : "default");
        let navIconClass = "fa fa-3x fa-laptop nav-icon-centered";
        let robotStatus = "Disabled";

        // Time
        let seconds = Math.floor(this.state.Time % 60.0).toString();
        //console.log(seconds);
        if(seconds.length == 1) seconds = "0" + seconds;
        let minutes = Math.floor(this.state.Time / 60.0);
        if(minutes > -1 && seconds > -1) {
            var timeRemaining = minutes + ":" + seconds;
        }
        else{
            var timeRemaining = "0:00";
        }
        let blink = (this.state.Time < 20.0 && this.state.Time % 2 != 10) ? "blink" : "";

        // Battery Icon
        let batteryClass = "fa fa-3x nav-icon-centered seperate-right fa-battery-";
        if(this.state.Battery >= BATTERY_4) batteryClass += "4";
        else if(this.state.Battery >= BATTERY_3) batteryClass += "3";
        else if(this.state.Battery >= BATTERY_2) batteryClass += "2";
        else if(this.state.Battery >= BATTERY_1) batteryClass += "1";
        else batteryClass += "0";

        switch(this.state.RobotState) {

        case "AUTONOMOUS":
            robotStatus = "Autonomous";
            break;

        case "TELEOP":
            robotStatus = "Teleop";
            break;

        case "TEST":
            robotStatus = "Test";
            break;

        case "DISABLED":
            robotStatus = "Disabled";
            break;

        default:
            robotStatus = "Disconnected";
            break;
        }

        return (
            <div>
                <nav className={navClass}>

                    {/* Unselectable to prevent the text being selected while dragging other elements*/}
                    <div className="container-fluid unselectable">

                        <div className="collapse navbar-collapse">

                            <p className="navbar-text">
                                <span className="nav-centered nav-xlarge-text seperate-right-half">
                                    <span>1458</span>
                                </span>

                                <span className="nav-centered">
                                    <div className="btn-group seperate-right-half">
                                        <a href="#" className="btn btn-info navbar-btn dropdown-toggle"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fa fa-plus fa-lg"/>
                                        </a>

                                        <ul className="dropdown-menu">
                                            <li><a href="#" onClick={this.addChildImage}>Image Stream</a></li>
                                            <li role="separator" className="divider"/>
                                            {this.state.keys.map((key) => {
                                                if(EXCLUDED.indexOf(key) == -1 && key.indexOf("_PID") == -1){
                                                    if(isNumber(this.state[key])){
                                                        return ([
                                                            <li><a href="#" onClick={this.addChild} data-id={key}>{key}</a></li>,
                                                            <li><a href="#" onClick={this.addChildGraph} data-id={key}>{key} (Graph)</a></li>
                                                        ]);
                                                    } else {
                                                        return ([
                                                            <li><a href="#" onClick={this.addChild} data-id={key}>{key}</a></li>
                                                        ]);
                                                    }
                                                }
                                                //console.log(this.addChild);
                                            })} {/* TODO move PID stuff into the section below */}
                                            <li role="separator" className="divider"/>
                                            <li className="dropdown-header">PID Calibration</li>
                                            {this.state.keys.map((key) => {
                                                if(key.indexOf("_PID_DEF") > -1) {
                                                    return ([
                                                        <li><a href="#" onClick={this.addPID} data-id={key}>{key.replace("_PID_DEF", "")}</a></li>
                                                    ]);
                                                }
                                                //console.log(this.addChild);
                                            })}
                                        </ul>
                                    </div>

                                    <div className="btn-group">
                                        <a href="#" className="btn btn-success navbar-btn" onClick={this.save}>
                                            <i className="fa fa-floppy-o fa-lg"/>
                                        </a>

                                        <a href="#" className="btn btn-success navbar-btn">
                                            <i className="fa fa-upload fa-lg"/>
                                        </a>
                                    </div>

                                </span>
                            </p>

                            <p className="navbar-text navbar-right">

                                <span className="nav-large-text nav-centered seperate-right">Mode:  {robotStatus}</span>

                                <span className="nav-large-text nav-centered">Battery:  {this.state.Battery.toFixed(1)}V</span>

                                <i className={batteryClass} />

                                {/*<span className="nav-icon-centered nav-large-text">DS: {this.state.Location}</span>

                                <i className={navIconClass+(this.state.Location !== 1 ? "-disabled" : "")} />
                                <i className={navIconClass+(this.state.Location !== 2 ? "-disabled" : "")} />
                                <i className={navIconClass+(this.state.Location !== 3 ? "-disabled" : "")} />*/}

                                <span className="nav-icon-centered nav-xlarge-text seperate-left">
                                    <span className={blink}>{timeRemaining}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>

                {this.state.childrenSet.map((child) => {
                    if(child.type === "DATA"){
                        return (
                            <DataWidget val={this.state[child.index].toString()} name={child.name} remove={this.getRemove(child.id)} ref={child.id}
                                        x={child.x} y={child.y} width={child.width} height={child.height} />
                        );
                    } else if(child.type === "CHART"){
                        return (
                            <ChartWidget val={this.state[child.index]} name={child.name} remove={this.getRemove(child.id)} ref={child.id}
                                         x={child.x} y={child.y} width={child.width} height={child.height} />
                        );
                    } else if(child.type === "IMAGE"){
                        return (
                            <ImageStream name={child.name} url={child.url} remove={this.getRemove(child.id)} ref={child.id}
                                         x={child.x} y={child.y} width={child.width} height={child.height} />
                        );
                    } else if(child.type === "PID"){
                        return (
                            <PidWidget name={child.name} kP={this.state[child.name+"_PID_kP"]}
                                       kI={this.state[child.name+"_PID_kI"]} kD={this.state[child.name+"_PID_kD"]}
                                        x={child.x} y={child.y} width={child.width} height={child.height}/>
                        );
                    } else {
                        return false; // Render Nothing
                    }
                })}


                <AutonomousChooser selected={this.state.SelectedAutoMode || 0} modes={JSON.parse(this.state.AutoModes || "[\"None Available\"]")} setAutonomous={this.setAutonomous} />

                <span className="robot-diagram-wrapper">

                </span>

                <svg id="robot-diagram" width="332" height="450">
                    <text x="80" y="340">Robot Diagram</text>

                    {/* Chassis */}
                    <rect x="75" y="360" width="230" height="40" />
                    <rect x="85" y="370" width="210" height="40" />

                    {/* Wheels */}
                    <circle cx="100" cy="410" r="25" />
                    <circle cx="190" cy="410" r="25" />
                    <circle cx="280" cy="410" r="25" />

                    {/* Bumpers */}
                    <rect x="60" y="380" width="250" height="30" />
                    <text x="155" y="405" id="team" text-anchor="middle">1458</text>
                </svg>

                <BrownOutModal/>
            </div>
        );
    }
}


function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 <div className="navbar-header">
 <a className="navbar-brand" href="#" style={{"fontSize":"24px"}}>Dashboard</a>
 </div>
 */
export default Dashboard;