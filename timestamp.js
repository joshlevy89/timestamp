var express = require('express');
var path = require('path');
var app = express();
var moment = require('moment');
var fs = require('fs');

// create the home page
fs.unlink(path.join(__dirname,'/public/css/main.css'),function(err) { // delete existing main.css file 
   if (err) {} // if no file, do nothing
});  
app.use('/',require('stylus').middleware(path.join(__dirname,'/public/css')));
app.use('/',express.static(path.join(__dirname,'/public')));

// render any generated content
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, '/public'));


app.get('/:query', function(req,res){
   var query = req.params.query;
   var unix = toUnix(query);
   var natural = toNatural(query);
   var o = {unix: unix,
            natural: natural
   };
   res.render('response',{date:JSON.stringify(o)});
  // res.json(o);
  });

app.listen(process.env.PORT);

// convert from natural time to unix time (if not already)
function toUnix(query) {
   if (Number(query)) { // if already number
      return Number(query);
   }
   else { // otherwise, convert date to number
      var d = moment(query, 'MMM DD YYYY');
      if (d.isValid()===true) {
      return d.unix();
      }
      else {
         return null;
      }
   }
};

function toNatural(query) {
   if (isNaN(Number(query))) {
      var d = moment(query, 'MMM DD YYYY'); // check that valid
      if (d.isValid()) {
      return d.format("MMMM DD, YYYY");
      }
      else {
         return null;
      }
   }
   else { // convert from unix
   var d = moment.unix(query).format("MMM DD, YYYY");
   return d;
   }
}
