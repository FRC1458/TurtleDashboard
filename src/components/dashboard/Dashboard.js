import React from "react";
import BrownOutModal from "../BrownOutModal.js";
import DataWidget from "./DataWidget.js";
import ChartWidget from "./ChartWidget.js";
import io from "../util/socket.js";

// TODO Set Battery Icons
// Placeholder Data
const BATTERY_1 = 12;
const BATTERY_2 = 13;
const BATTERY_3 = 14;
const BATTERY_4 = 15;

const EXCLUDED = ["Alliance", "Location", "RobotState", "Time", "BrownOut", "RightAxis", "LeftAxis"];

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {Alliance: "BLUE", Location: 2, RobotState: "DISABLED",
            Time: 165.0, Battery: 12.0, BrownOut: false, keys: [], children: [{index: "Battery", name: "Battery", type: "DATA"}]};

        io.on("update", (obj) => {
            console.log(obj);

            // Reassign the state into new object
            let objKeys = Object.keys(obj);
            let newKeys = Object.assign([], this.state.keys, objKeys);
            console.log(newKeys);

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

            console.log(s);

            this.setState(s);
        });
    }

    render() {
        let navClass = "navbar navbar-" + (this.state.Alliance === "BLUE" ? "default" : "inverse");
        let navIconClass = "fa fa-3x fa-laptop nav-icon-centered";
        let robotStatus = "Disabled";

        // Time
        let seconds = Math.floor(this.state.Time % 60.0).toString();
        console.log(seconds);
        if(seconds.length == 1) seconds = "0" + seconds;
        let timeRemaining = Math.floor(this.state.Time / 60.0) + ":" + seconds;
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
                                    <span>####</span>
                                </span>

                                <span className="nav-centered">
                                    <div className="btn-group">
                                        <a href="#" className="btn btn-lg btn-info navbar-btn dropdown-toggle"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                            Add Item <span className="caret" />
                                        </a>
                                        <ul className="dropdown-menu">
                                            {this.state.keys.map((key) => {
                                                if(EXCLUDED.indexOf(key) == -1) return (
                                                    <li><a href="#">{key}</a></li>
                                                );
                                            })}
                                            <li role="separator" className="divider"/>
                                            <li><a href="#">Drive Control Viewer</a></li>
                                            <li><a href="#">PID Calibration</a></li>
                                        </ul>
                                    </div>
                                </span>
                            </p>

                            <p className="navbar-text navbar-right">

                                <span className="nav-large-text nav-centered seperate-right">Mode:  {robotStatus}</span>

                                <span className="nav-large-text nav-centered">Battery:  {this.state.Battery.toFixed(1)}V</span>

                                <i className={batteryClass} />

                                <span className="nav-icon-centered nav-large-text">DS: {this.state.Location}</span>

                                <i className={navIconClass+(this.state.Location !== 1 ? "-disabled" : "")} />
                                <i className={navIconClass+(this.state.Location !== 2 ? "-disabled" : "")} />
                                <i className={navIconClass+(this.state.Location !== 3 ? "-disabled" : "")} />

                                <span className="nav-icon-centered nav-xlarge-text seperate-left">
                                    <span className={blink}>{timeRemaining}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>

                {this.state.children.map((child) => {
                    if(child.type === "DATA"){
                        return (
                            <DataWidget val={this.state[child.index].toString()} name={child.name}/>
                        );
                    } else if(child.type === "CHART"){
                        return (
                            <ChartWidget val={this.state[child.index]} name={child.name}/>
                        );
                    }
                })}

                <BrownOutModal />
            </div>
        );
    }
}


/*
 <div className="navbar-header">
 <a className="navbar-brand" href="#" style={{"fontSize":"24px"}}>Dashboard</a>
 </div>
 */
export default Dashboard;