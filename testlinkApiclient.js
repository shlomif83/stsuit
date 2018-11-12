var xmlrpc = require('xmlrpc');

var client = xmlrpc.createClient({ host: 'testlink2.local', port: 80, path: '/lib/api/xmlrpc/v1/custom_xmlrpc.php' })
const axios = require('axios');

// function getTestProjectByName(devKey, testprojectname) {
//     var projectId = 0
//     var getTestProjectByName = client.methodCall('tl.getTestProjectByName', [{ devKey: devKey, testprojectname: testprojectname }], (error, value) => {
//         projectId = value.id;
//     })
//     console.log("sagfdshgfdh   " + getTestProjectByName);

//     // return projectId;
// }

// // console.log(getTestProjectByName('20b497c0a4ae51e2869653bcca22727e', 'demo 2'));

// function a(name, cb) {
//     console.log(name);
//     cb()
// }
// a("shlomi", function () {
//     console.log("this is cb");

// })
function callApiWithTestLink() {

    var promise1 = new Promise(function (resolve, reject) {
        client.methodCall('tl.getProjects', [{ devKey: '20b497c0a4ae51e2869653bcca22727e' }], function (error, value) {
            if (error || value[0].code == 2000) {
                reject(error || value[0].message);
            }
            else resolve(value)
        })
    })
    return promise1
}
var promise1 = callApiWithTestLink();
// console.log(promise1);
promise1.then((value) => {
    console.log(value);
    return "123456789" //axios.default.get('https://google.com');

}).then((value) => {
    console.log("aaaaa " + value);

}).catch((rejection) => {
    console.log(rejection);
})

