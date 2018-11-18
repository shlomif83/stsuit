var mysql = require('mysql');

var con = mysql.createConnection({
  host: "testlink2.local",
  user: "rtsuitetestlinksync",
  password: "Inpecman1",
  database:'rtsuitetestlinksync'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
