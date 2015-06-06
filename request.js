/**
 * Created by jianxinhu on 15/6/5.
 */
var request = require('superagent-charset');
var cheerio = require('cheerio');
var async = require("async");
//var iconv = require('nv-lite');

var PostModel = require('./Model').post;

function r(){}

r.clearData = function(fn){
    PostModel.remove({}).exec(fn);
}

r.request = function(page,fn){

    var url = 'http://www.597mm.com/sell/index.php?page='+page;
    console.log("REQUEST: ",url);

    request
        .get(url)
        .charset('gbk')
        .set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .end(function(err, res){

            var $ = cheerio.load(res.text,{
                normalizeWhitespace: true,
                xmlMode: true,
                decodeEntities: false
            });

            $("script").remove();

            var dataRow = $(".list");

            //console.log(dataRow.length);

            //for(var i = 0 ; i < dataRow.length ; i++){

            async.forEachSeries(dataRow,function(item,next){

                var obj = item;
                var title = $($(obj).find("h3>a")).text();
                var href =$($(obj).find("h3>a")).attr("href");
                var contactBox = $($(obj).find("ul>li")[2]);
                var contactStr = r.filter(contactBox.text());
                var publishAt = $(obj).find(".px11");

                var publishAtStr = publishAt.text().replace(/\&nbsp\;/ig,'');




                var contact = contactStr.split('电话：');

                r.requestDesc(href,function(obj){

                    obj.name=contact[0];
                    obj.phone=contact[1].trim();
                    obj.title = title;
                    obj.publishAt = (new Date(publishAtStr))/1000;



                    PostModel.create(obj,function(err,result){



                        if(err)
                            console.log(err);

                        console.log("obj : "+JSON.stringify(result,'','\t'));

                        next(err);
                    })


                })
            },function(err){
                fn();
            });
        });
}

r.filter = function(str){

    var source = str;
    source= source.replace('联系人：','');
    source= source.replace('[email\&\#160\;protected]','乔峰');
    //source= source.replace('电话：','');
    source= source.replace(',',' ');
    source= source.replace(/，/ig,' ');
    source= source.replace(/、/ig,'');
    source= source.replace(/\^/ig,'');
    source= source.replace(/\~/ig,'');
    source= source.replace(/\//ig,'');
    source= source.replace('[查看详情]','');

    return source;

}

r.requestDesc = function(url,fn){

    request
        .get(url)
        .charset('gbk')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .end(function(err, res){

            var $ = cheerio.load(res.text,{
                normalizeWhitespace: true,
                xmlMode: true,
                decodeEntities: false
            });

            $("script").remove();

            var contact_body = $($(".contact_body").find("li:last-child"));

            var content = $(".content");

            var address = contact_body.text().toString().replace(/ /ig,'').replace(/地址/ig,'');

            var album = $('.album').find('tr')[1];

            var imgs = $(album).find("img");

            var pic = [];

            for(var index=0;index<imgs.length;index++){

                var obj = imgs[index];

                var imgUrl = $(obj).attr("onmouseover").toString().match(/[a-zA-z]+\:\/\/[^\s]*.[A-Za-z]/ig)[0];

                pic.push(imgUrl);

            }

            var contentText = $(content).text().replace(/\&nbsp\;/ig,'');

            var descInfo = {
                "address":address,
                "pic":pic,
                "content":contentText
            };

            fn(descInfo);

        });
}

r.toPage = function(pages,fn){

    async.timesSeries(pages,function(index,next){

        r.request(index,function(){
            next();
        });

    },function(err,result){
        console.log("complete");

        fn();
    });

}

module.exports = r;

//r.requestDesc("http://www.597mm.com/sell/show.php?itemid=348989",function(obj){
//    console.log(obj);
//});


//r.clearData(function(){
//
//    async.timesSeries(1,function(index,next){
//
//        r.request(index,function(){
//            next();
//        });
//
//    },function(err,result){
//        console.log("complete");
//    });
//
//
//});
//
