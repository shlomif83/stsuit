// const createProject = require('./index')

const axios = require('axios');

// // axios.get('http://10.2.1.119:5500/api/project/allProjects').then((res) => {
// //     console.log(res.data);

// // })
// let projectData = {
//     projectName: '',
//     id: ''
// }
// var url1 = 'http://10.2.1.119:5500/api/project/allProjects'
// function getDataApiScoper(url) {
//     axios.get(url).then((res) => {
//         res.data.map((item, index) => {
//             projectData.id=item._id
//             console.log(item._id, index);
//             // console.log(projectData);
//         })
//     })
// }


var urlId = 'http://10.2.1.119:5000/api/userStory/allStories/5bdf0ecb720006107cc1d6d9';
// // axios.get(urlId).then((res)=>{
// //     console.log(res);   
// // })
// // getDataApiScoper(url1)
// function getProjetcById(projId) {
//     axios.get()
// }
// axios.default.get(urlId).then((res) => {
//     console.log(res.data);

// })



function createTestCasePrefix(projectName, cb) {
    var projectNameSplit = projectName.trim().split("");
    projectNameSplit.map((char, index) => {
        if (char == " ") {
            var testCasePrefix = projectNameSplit[0] + "_" + projectNameSplit[index + 1].toUpperCase()
            cb(testCasePrefix)
            return testCasePrefix;
        }
    })
}

createTestCasePrefix("    TSG aaa   ",function(testCasePrefix) {
    console.log(testCasePrefix);   
})

