const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'))

app.set('view engine', 'pug')

async function fetchNews(callback) {
  const url = 'https://www.thehindu.com/';
  data = [];
  var_list = ['int','nat','spo','bus','sci','art']
  news = {};
  elec = [];
  int = [];
  nat = [];
  spo = [];
  bus = [];
  sci = [];
  tec = [];
  var temp ="";
  axios.get(url)
    .then(response => {
        console.log("Done fetching");
        html = response.data;
        const $ = cheerio.load(html);

        $('.story4-sub-cont h3 a').each((i,elem) => {
          data.push($(elem).text().replace(/\r?\n|\r/, ''));
        });
        $('.story4-3x33-sub-cont h3 a').each((i,elem) => {
          var temp = $(elem).text().replace(/\r?\n|\r/, '');
          temp = temp.replace(' | ','');
          elec.push(temp);
        });

        if(data.length == 0)
          throw new Error('Cannot be fetched');
        // console.log('Data is', data);
        int = data.slice(0,3);
        nat = data.slice(3,6);
        spo = data.slice(6,10);
        bus = data.slice(10,14);
        sci = data.slice(14,17);
        tec = data.slice(17,20);
        news = {
                'International':int,
                'National':nat,
                'Sports':spo,
                'Business':bus,
                'Science':sci,
                'Technology':tec,
                'Election':elec
              };
        callback(news, 'Fetched', true);
      })
    .catch(error => {
      console.log(error.message);
      callback([], error.message, false);
    });
}

var imgsrc = '../img/spinner.gif';
var news,status = 'Fetching';

fetchNews((n,e,f) => {
  news = n;
  status = e;
  if(f)
    imgsrc = './img/success.png';
  else
    imgsrc = './img/fail.png';

  io.emit('status', [imgsrc, e]);
});

app.get('/', (req, res) => {
  console.log('------- / -------');
  console.log('The variables are');
  console.log('news ', news);
  console.log('imgsrc ', imgsrc);
  console.log('Status', status);
  console.log('------- / -------');

  res.render('index', {imgsrc: imgsrc, status: status });
});

app.get('/favicon.ico', (req, res) => {
  // Browser by default fetches favico.ico and it matches with the route below
  res.statusCode = 204;
});

app.get('/:category', (req,res) => {
  
  var category = req.params.category;
  console.log('Category is ' + category);
  console.log('Requested Url ', req.originalUrl);

  var headlines = news[category];
  console.log("Served :");
  console.log(headlines);

  res.render('news', {category: category, headlines: headlines});
    
});

server.listen(3000);
