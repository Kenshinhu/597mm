/**
 * Created by jianxinhu on 15/5/28.
 */
var m = require('mongoose');
var s = m.Schema;

var schema = new s({
    "title"    : String,
    "address"  : String,
    "pic"      : [String],
    "name"     : String,
    "phone"    : String,
    "content"  : String,
    "publishAt" :{type:Number,default:0},
    "createAt"   : {type:Number,default:0}
});

m.model('postsData',schema);