var xmlrpc = require('xmlrpc');

const axios = require('axios');



var client = xmlrpc.createClient({ host: 'testlink2.local', port: 80, path: '/lib/api/xmlrpc/v1/custom_xmlrpc.php' })

var urlAllProjects = 'http://10.2.1.119:5000/api/project/allProjects';


// function addReqSpec(params) {
//     var addReqSpec = client.methodCall("tl.addReqSpec", [params], (error, value) => {
//         console.log(error, value);
//     });
// }


function getProjectInfoFromApi(url) {
    var info = {
        devKey: "20b497c0a4ae51e2869653bcca22727e",
        testprojectname: "",
        testcaseprefix: "",
        notes: "",
        options: [1, 1, 1, 1],
        active: 1,
        public: 1
    }
    axios.default.get(url).then((res) => {
        return info;
    })
}


function getReqSpecInfoFromApi(url, message, reqSpecName) {
    var info = {
        devKey: "20b497c0a4ae51e2869653bcca22727e",
        testprojectid: "",
        parentid: "",
        reqspecdocid: "",
        title: "",
        scope: ""
    }
    axios.default.get(url).then((res) => {
        res.data.subjects.map((item) => {
            if (item.subjectName == reqSpecName) {
                info.reqspecdocid = item.subjectName;
                info.title = item.subjectName;
                info.scope = item.subjectDescreption;
                getTestProjectByName(info.devKey, message, function (projectId) {
                    console.log('project id: ' + projectId);
                    info.parentid = projectId
                    info.testprojectid = projectId
                    client.methodCall('tl.addReqSpec', [info], (error, value) => {
                        console.log('value: ' + JSON.stringify(value));
                    });
                });
            }
        })
    })
}




// getReqSpecInfoFromApi('http://10.2.1.119:5000/api/userStory/allStories/5bdf0ecb720006107cc1d6d9', 'demo 2', 'login')
/**
 * this is an example 
 * @param {*} url link to whatever
 * @returns None
 */
function getReqInfoFromApi(url, projectName, reqSpecDocId, requirementName) {
    var info = {
        devKey: "20b497c0a4ae51e2869653bcca22727e",
        testprojectid: '',
        reqspecid: "sdf",
        requirementdocid: "",
        title: "",
        scope: "",
        status: "V",
        requirementtype: "3",
        // number of test cases neded
        expectedcoverage: "2"
    }
    getTestProjectByName(info.devKey, projectName, function (projectId) {
        info.testprojectid = projectId;
        getReqSpecByDocId(info.devKey, info.testprojectid, reqSpecDocId, function (reqSpecId) {
            info.reqspecid = reqSpecId;
            axios.default.get(url).then((res) => {
                res.data.subjects.map((item, index) => {
                    if (item.subjectName == reqSpecDocId) {
                        item.requirements.map((req) => {
                            if (req.title == requirementName) {
                                info.requirementdocid = req.title;
                                info.title = req.title;
                                info.scope = req.userStory;
                                client.methodCall('tl.addRequirement', [info], (error, value) => {
                                    console.log(error, value);
                                })
                            }
                        })
                    }
                });
            });

        })
    });
}


addRequirement('http://10.2.1.119:5000/api/userStory/allStories/5bdf0ecb720006107cc1d6d9', 'demo 2', 'login', 'e')



function getReqSpecByDocId(devKey, testProjectId, reqSpecDocId, cb) {
    var reqSpecId = 0;
    client.methodCall('tl.getReqSpecByDocId', [{ devKey: devKey, testprojectid: testProjectId, reqspecdocid: reqSpecDocId }], (error, value) => {
        reqSpecId = value.id
        cb(reqSpecId);
        console.log('value:' + JSON.stringify(value.id));
    });
}

function createProject(url) {
    var params = getProjectInfoFromApi(url);
    console.log(params);
    var createProject = client.methodCall('tl.createTestProject', [params], (error, value) => {
        console.log(error, value);
    })
}

function addRecSpec(url, message, reqSpecName) {
    getReqSpecInfoFromApi(url, message, reqSpecName)
}
// addRecSpec('http://10.2.1.119:5000/api/userStory/allStories/5bdf0ecb720006107cc1d6d9', 'demo 2', 'bla * 3')



function addRequirement(url, projectName, reqspecdocid, requirementName) {
    getReqInfoFromApi(url, projectName, reqspecdocid, requirementName)
}


function getTestProjectByName(devKey, testprojectname, cb) {
    var projectId = 0
    var getTestProjectByName = client.methodCall('tl.getTestProjectByName', [{ devKey: devKey, testprojectname: testprojectname }], (error, value) => {
        projectId = value.id;
        cb(projectId)
    })
}




module.exports.createProject = createProject;
