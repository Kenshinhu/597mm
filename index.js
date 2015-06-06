/**
 * Created by jianxinhu on 15/6/6.
 */
var request = require('./request');


var args = process.argv.slice(2);
var clearArgs = process.argv.slice(3);

var pages = args[0] || 1;
var clear = clearArgs[0];

var start = function(){
    request.toPage(pages,function(){
        process.exit(0);
    })
}

if(clear==="--clear"){
    console.log("Ready to ClearData");
    request.clearData(function(){
       start();
    });
}else{
    start();
}






