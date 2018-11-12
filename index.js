var xmlrpc = require('xmlrpc');

const axios = require('axios');



var client = xmlrpc.createClient({ host: 'testlink2.local', port: 80, path: '/lib/api/xmlrpc/v1/custom_xmlrpc.php' })

var urlAllProjects = 'http://10.2.1.119:5000/api/project/allProjects';


/**
 * create test prefix from string
 * @param {*projectName} projectName 
 * @param {*callBeck} cb 
 * @param {*callBeck} cb2 
 */
function createTestCasePrefix(projectName, cb, cb2) {
    var projectNameSplit = projectName.trim().split("");
    projectNameSplit.map((char, index) => {
        if (char == " ") {
            var testCasePrefix = projectNameSplit[0] + "_" + projectNameSplit[index + 1].toUpperCase()
            cb(testCasePrefix)
        }
    })
    var testCasePrefix = projectName[0]
    cb2(testCasePrefix)
}


/**
 * 
 * @param {*url for all projects} urlAllProjects 
 * @param {* project name} projectName 
 * @param {* callBeck for url spec} cb 
 */
function getUrlSpec(urlAllProjects, projectName, cb) {
    axios.default.get(urlAllProjects).then((res) => {
        res.data.map((project) => {
            if (project.projectName == projectName) {
                var urlSpec = "http://10.2.1.119:5000/api/userStory/allStories/" + project._id + "";
                cb(urlSpec)
            }
        })
    })
}

/**
 * 
 * @param {*url spec} urlSpec 
 */
function createReqSpecOnProject(urlSpec) {
    axios.default.get(urlSpec).then((res) => {
        res.data.subjects.map((reqSpec) => {
            addRecSpec(urlSpec, res.data.projectName, reqSpec.subjectName)

            reqSpec.requirements.map((requirement) => {
                addRequirement(urlSpec, res.data.projectName, reqSpec.subjectName, requirement.title)
            })


            // var params = {
            //     devKey: "20b497c0a4ae51e2869653bcca22727e"
            // }
            // getTestProjectByName(params.devKey, res.data.projectName, function (projectId) {
            //     params.testprojectid = projectId;
            //     params.parentid = projectId;
            //     params.reqspecdocid = reqSpec.subjectName;
            //     params.title = reqSpec.subjectName;
            //     params.scope = reqSpec.subjectDescreption;
            //     client.methodCall('tl.addReqSpec', [params], function (error, value) {
            //         var paramsForReq = {
            //             status: "V",
            //             requirementtype: "3",
            //             // number of test cases neded
            //             expectedcoverage: "2"
            //         }
            //         reqSpec.requirements.map((requirement) => {
            //             getReqSpecByDocId(params.devKey, params.testprojectid, params.reqspecdocid, function (reqSpecId) {
            //                 paramsForReq.devKey = params.devKey;
            //                 paramsForReq.testprojectid = params.testprojectid;
            //                 paramsForReq.reqspecid = reqSpecId;
            //                 paramsForReq.requirementdocid = requirement.title;
            //                 paramsForReq.title = requirement.title;
            //                 paramsForReq.scope = requirement.userStory;
            //                 client.methodCall('tl.addRequirement', [paramsForReq], function (error, value) {
            //                     console.log(error, value);
            //                 })
            //             })

            //         });
            //         console.log(error, value);
            //     })
            // })
        })
    });
};
function getProjectInfoFromApi(urlAllProjects, projectName) {
    var infoForCraeteProject = {
        devKey: "20b497c0a4ae51e2869653bcca22727e",
        testprojectname: "",
        testcaseprefix: "",
        notes: "",
        options: [1, 1, 1, 1],
        active: 1,
        public: 1
    }
    getUrlSpec(urlAllProjects, projectName, function (urlSpec) {
        axios.default.get(urlSpec).then((res) => {
            infoForCraeteProject.testprojectname = res.data.projectName;
            createTestCasePrefix(projectName, function (testCasePrefix) {
                infoForCraeteProject.testcaseprefix = testCasePrefix;
            }, function (testCasePrefix) {
                infoForCraeteProject.testcaseprefix = testCasePrefix;
            })
            client.methodCall('tl.createTestProject', [infoForCraeteProject], (error, value) => {
                createReqSpecOnProject(urlSpec);
                console.log(error, value);
            })


        })
    })
}

createProject('http://10.2.1.119:5000/api/project/allProjects', 'TRB');

function createProject(urlAllProjects, projectName) {
    getProjectInfoFromApi(urlAllProjects, projectName);
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







/**
 * this is an example 
 * @param {*} url link to whatever
 * @returns None
 */
function getReqInfoFromApi(url, projectName, reqSpecDocId, requirementName) {
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa: " + projectId);
        info.testprojectid = projectId;
        getReqSpecByDocId(info.devKey, info.testprojectid, reqSpecDocId, function (reqSpecId) {
            console.log('eeeeeeeeeeeeeeeeeeeee  ' + reqSpecId);

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


// addRequirement('http://10.2.1.119:5000/api/userStory/allStories/5bdf0ecb720006107cc1d6d9', 'demo 2', 'login', 'e')



function getReqSpecByDocId(devKey, testProjectId, reqSpecDocId, cb) {
    var reqSpecId = 0;
    client.methodCall('tl.getReqSpecByDocId', [{ devKey: devKey, testprojectid: testProjectId, reqspecdocid: reqSpecDocId }], (error, value) => {
        reqSpecId = value.id
        console.log('value:' + reqSpecId);
        cb(reqSpecId);
    });
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
        // console.log('error: '+error);
        
        projectId = value.id;
        cb(projectId)

    })
}




module.exports.createProject = createProject;
