const redis = require('redis');
const createProject = require('./index')


const client = redis.createClient(6379, '10.2.1.109');




client.subscribe('newProject', (channel, message) => {
    console.log(channel, message);
})

client.subscribe('addReq', (channel, message) => {
})

client.on('message', (channel, message, reqSpecName) => {
    switch (channel) {
        case "newProject":
            createProject.createProject(params)
            break;
        case "addRecSpec":

            break
        case "addReq":
            addReq(params)
            break;
        default:
            break;
    }

})