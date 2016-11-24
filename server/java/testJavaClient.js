var java = require("java");

java.classpath.push("ntcore-osx.jar");

var NetworkTable = java.import("edu.wpi.first.wpilibj.networktables.NetworkTable");
NetworkTable.setClientModeSync();
NetworkTable.setIPAddressSync("127.0.0.1");

var table = NetworkTable.getTableSync("SmartDashboard");

setInterval(() => {
    var keys = table.getKeysSync();
    var array = keys.toArraySync();
    console.log(array[0]);
    for(var x = 0; x < array.length; x++){
        array[x] = array[x] + " : " + table.getValueSync(array[x], null);
    }
    console.log(array);
}, 1000);
