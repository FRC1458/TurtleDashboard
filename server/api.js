import java from "java";

java.classpath.push("ntcore-osx.jar");

let obj = {};
let first = true;

export function setupAPI(app, ip) {

    var NetworkTable = java.import("edu.wpi.first.wpilibj.networktables.NetworkTable");
    NetworkTable.setClientModeSync();
    NetworkTable.setIPAddressSync(ip);

    var SmartDashboard = NetworkTable.getTableSync("SmartDashboard");


    SmartDashboard.addTableListenerSync(java.newProxy("edu.wpi.first.wpilibj.tables.ITableListener", {
        valueChangedEx(table, key, value, flags) {
            let isNew = ((flags & 4) == 4) || ((flags & 1 == 1));
            console.log("Value Changed: "+key+"="+value+". New="+isNew);
            obj[key] = value;
            console.log(obj);
        }
    }), true);

    /*socket.on("setAutonomous", (autoMode) => {
        console.log("Set "+autoMode);
        SmartDashboard.putNumber("SelectedAutoMode", autoMode);
    });*/


    app.get("/setAutonomous", (req, res) => {
        let autoMode = req.query.autoMode;
        if(!autoMode) {
            res.end("INVALID_INPUT");
            return;
        }
        let autoModeInt = parseInt(autoMode);
        if(autoModeInt < 0 || autoModeInt > 25) {
            res.end("INVALID_INPUT");
            return;
        }
        console.log("Set "+autoMode);
        SmartDashboard.putNumberSync("SelectedAutoMode", autoModeInt);
        obj["SelectedAutoMode"] = autoModeInt;
        res.end("OK");
    });

    app.get("/api", (req, res) => {
        res.end(JSON.stringify(obj));
    });
}