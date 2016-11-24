var java = require("java");

java.classpath.push("ntcore-osx.jar");

var NetworkTable = java.import("edu.wpi.first.wpilibj.networktables.NetworkTable");
//NetworkTable.setClientModeSync();
//NetworkTable.setIPAddressSync("127.0.0.1");

var table = NetworkTable.getTableSync("SmartDashboard");

var x = 0.0;
/*setInterval(() => {
    table.putNumberSync("Number", x++);
    table.putNumberSync("second", x/10.0);
    table.putNumberSync("third", 4.0);
    console.log(x);
}, 1000);*/

table.putBooleanSync("BrownOut", false);
table.putStringSync("RobotState", "DISABLED");
table.putNumberSync("LeftAxis", 0.0);
table.putNumberSync("RightAxis", 0.0);

table.putStringSync("Alliance", "NONE");


// Show DS Number
table.putNumberSync("Location", 1);

// Show Timer and Battery
table.putNumberSync("Time", 100);
table.putNumberSync("Battery", 12);

setInterval(() => {
    if(table.getNumberSync("Time", 0.0) > 0){
        table.putNumberSync("Time", table.getNumberSync("Time", 1.0)-1);
    }
}, 1000);