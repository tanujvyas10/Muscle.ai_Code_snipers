const { MongoClient } = require('mongodb')
// const url = 'mongodb://127.0.0.1/hackTIET';
const url = 'mongodb+srv://admin101:rcemmaw15@cluster2019-vg1ij.mongodb.net/test?retryWrites=true&w=majority'

const connectdb = (dbname) => {
    return MongoClient.connect(url,{useNewUrlParser:true})
    .then(client => client.db(dbname))
}

module.exports = {
    connectdb
}