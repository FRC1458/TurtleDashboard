// /Users/anish/Anish/Programming_Workspaces/Robotics/ntcore-3.1.2/native/ntcore/build/libs/ntcore/shared/x64/libntcore.dylib
var java = require("java");

java.classpath.push("ntcore-osx.jar");

var NetworkTable = java.import("edu.wpi.first.wpilibj.networktables.NetworkTable");
//NetworkTable.setClientModeSync();
//NetworkTable.setIPAddressSync("127.0.0.1");

var table = NetworkTable.getTableSync("SmartDashboard");

var x = 0;
setInterval(function () {
    console.log(table.putNumberSync("Number", x++));
}, 1000);
