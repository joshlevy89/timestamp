var express = require('express');
var app = express();
var moment = require('moment');

app.get('/', function(req,res){
   res.send('PLEASE ENTER A DATE');
});

app.get('/:query', function(req,res){
   var query = req.params.query;
   var unix = toUnix(query);
   var natural = toNatural(query);
   var o = {unix: unix,
            natural: natural
   };
   res.json(o);
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
