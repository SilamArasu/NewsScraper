const axios = require('axios');
const cheerio = require('cheerio');
var express=require('express');
var app=express();

const url = 'https://www.thehindu.com/';
data = [];
var_list = ['int','nat','spo','bus','sci','art']
elec = [];
news = {};
int=[];
nat=[];
spo=[];
bus=[];
sci=[];
tec=[];
var temp ="";
axios.get(url)
  .then(response => {
    let getData = html => {

      const $ = cheerio.load(html);
      $('.story4-sub-cont h3 a').each((i,elem) => {

        data.push($(elem).text().replace(/\r?\n|\r/, ''));
      });
      $('.story4-3x33-sub-cont h3 a').each((i,elem) => {
        var temp = $(elem).text().replace(/\r?\n|\r/, '');
        temp = temp.replace(' | ','');
        elec.push(temp);
      });

      // console.log(data);
      int = data.slice(0,3);
      nat = data.slice(3,6);
      spo = data.slice(6,10);
      bus = data.slice(10,14);
      sci = data.slice(14,17);
      tec = data.slice(17,20);
      // console.log(int);
      // console.log(nat);
      // console.log(spo);
      // console.log(bus);
      // console.log(sci);
      // console.log(art);
      // console.log(elec);
      news = {'int':int,'nat':nat,'spo':spo,'bus':bus,'sci':sci,'tec':tec,'elec':elec};
      // temp = news['spo'].join();
      console.log(news);
      console.log("Done fetching");

    }

    getData(response.data)
  })
  .catch(error => {
    console.log(error);
  })

console.log("--------------------------------------------------");


app.get('/',function(req,res)
{
var i;
var par = req.query.name;
var fpar = req.query.fname;
var parseResult;
parseResult = news[par];
console.log("Served :");
console.log(parseResult);

var htmlResult = "";
htmlResult+='<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8">'
htmlResult+='<style>div{width: 600px;margin: 200px 450px;}h2{font: 400 40px/1.5 Helvetica, Verdana, sans-serif;margin: 0;padding: 0;}ul{list-style-type: none;margin: 0;padding: 0;}li{font: 200 20px/1.5 Helvetica, Verdana, sans-serif;border-bottom: 1px solid #ccc;}li:last-child{border: none;}li a {text-decoration: none;color: #000;display: block;width: 400px;-webkit-transition: font-size 0.3s ease, background-color 0.3s ease;transition: font-size 0.3s ease, background-color 0.3s ease;}li a:hover{font-size: 30px;background: #f6f6f6;}</style>';
htmlResult+='<title></title></head><body><div><h2>';
htmlResult+=fpar;
htmlResult+='</h2><ul>';
for (i = 0; i < parseResult.length; i++) {
  htmlResult+='<li><a href="#">';
  htmlResult+=parseResult[i];
  htmlResult+='</a></li>';
}
htmlResult+='</ul></div></body></html>';
// console.log(htmlResult);
res.send(htmlResult);
});
var server=app.listen(3000,function() {});
