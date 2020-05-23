const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var app = express();

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
        callback(news, 'Fetched');
      })
    .catch(error => {
      console.log(error.message);
      callback([], error.message);
    });
}

var news,status;

fetchNews((n,e) => {
  news = n;
  status = e;
});

app.get('/', (req, res) => {
  console.log('Status', status);
  res.render('index', {status: status ? status:'Fetching'});
});

app.get('/favicon.ico', (req, res) => {
  // Browser by default fetches favico.ico and it matches with the route below
  res.statusCode = 204;
});

app.get('/:category', (req,res) => {
  
  var category = req.params.category;
  console.log('Category is ' + category);

  var headlines = news[category];
  console.log("Served :");
  console.log(headlines);

  res.render('news', {category: category, headlines: headlines});
    
});

var server=app.listen(3000,() => console.log('Listening for client connection'));
