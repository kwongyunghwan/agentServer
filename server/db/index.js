require('dotenv').config({path:"../.env"})
const MongoClient = require('mongodb').MongoClient;

const { DB_URI, DB_NAME } = process.env;

async function connectToDatabase(){
    MongoClient.connect(DB_URI, function(err, client){
        if(err){
        console.error('몽고 db 연결에 실패하였습니다.');
        return;
        }else{
        global.db = client.db(DB_NAME);
        
        console.log('몽고 db 연결에 성공했습니다.');
        
        }
        return client
    });
}
module.exports = { connectToDatabase };