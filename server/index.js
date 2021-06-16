var express = require('express');
var cors = require("cors");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var fs = require('fs');
let jsonObj = {
   "usersList": []
};
var createStream;
if (!(fs.existsSync('registerDetail.json'))) {
   createStream = fs.createWriteStream("registerDetail.json");
   createStream.write(JSON.stringify(jsonObj));
   createStream.end();
}
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.post('/saveRegisterForm', function (req, res) {
   var responseData;
   fs.readFile('registerDetail.json', function (err, data) {
      if (err) {
         throw err;
      }
      responseData = JSON.parse(data);
      if (responseData) {
         if (responseData.usersList.length > 0) {
            for (let i = 0; i < responseData.usersList.length; i++) {
               if ((responseData.usersList[i].username == req.body.username) || (responseData.usersList[i].email == req.body.email)) {
                  res.statusMessage = 'Already Registered. Try with different Username or Emailid';
                  res.status(400).send();
                  return;
               }
            }
         }
         responseData.usersList.push(req.body);
         fs.writeFile('registerDetail.json', JSON.stringify(responseData),function(err, result) {   
               if(err) 
               console.log('error', err);   
             });
         res.statusMessage = "Registration Successful";
         res.status(200).send();
      }
      else {
         res.sendStatus(500);
      }
   });
});
app.post('/saveLoginForm', function (req, res) {
   var responseData = readData();
   if (responseData) {
      if (responseData.usersList.length == 0) {
         res.statusMessage = "Please Register First";
         res.status(400).send();
         return;
      }
      for (let i = 0; i < responseData.usersList.length; i++) {
         if (responseData.usersList[i].email === req.body.username) {
            if (responseData.usersList[i].password === req.body.password) {
               res.statusMessage = responseData.usersList[i].username;
               res.status(200).send();
            }
            else {
               res.statusMessage = "Incorrect Password";
               break;
            }
         }
         else {
            res.statusMessage = "Invalid User/Unregistered User";
         }
      }
      res.status(400).send();
   }
});
function readData() {
   var respData = fs.readFileSync('registerDetail.json');
   return JSON.parse(respData);
}
var server = app.listen(3000, "localhost", function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})