/**
 * Created by jianxinhu on 15/6/6.
 */
var request = require('./request');


var args = process.argv.slice(2);

var pages = args[0] || 1;

request.toPage(pages,function(){
    process.exit(0);
})

