import socket from "socket.io";
import java from "java";

java.classpath.push("ntcore-osx.jar");

let obj = {};
let first = true;

export function setupAPI(server, ip) {

    var NetworkTable = java.import("edu.wpi.first.wpilibj.networktables.NetworkTable");
    NetworkTable.setClientModeSync();
    NetworkTable.setIPAddressSync(ip);

    var SmartDashboard = NetworkTable.getTableSync("SmartDashboard");

    var io = socket(server);

    io.on("connection", (socket) => {
        // New Clients should get the old data once
        if(!first) {
            io.emit("update", obj);
        }
        first = false;
        SmartDashboard.addTableListenerSync(java.newProxy("edu.wpi.first.wpilibj.tables.ITableListener", {
            valueChangedEx(table, key, value, flags) {
                let isNew = ((flags & 4) == 4) || ((flags & 1 == 1));
                console.log("Value Changed: "+key+"="+value+". New="+isNew);
                obj[key] = value;
                console.log(obj);
                io.emit("update", obj);
            }
        }), true);
    });
}