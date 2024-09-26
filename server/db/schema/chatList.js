const mongoose = require('mongoose');
// 아래와 같이 작성한 기준으로 데이터를 DB에 넣기 전에 먼저 검사합니다.
// required는 필수입력, default는 기본값
// 방번호, 유저ID에 복합인덱스로 걸음 
const chatListSchema = new mongoose.Schema({
    chat_id : { type: String, require: true},
    cnsr_code: { type: String },
    cus_code: { type: String, required: true},
    status: { type: Number, required: true},
    chat_memo: {type: String},
    created_at: { type: Date, default: Date.now }
});
chatListSchema.index({cus_code: 1, chat_id: 1});

module.exports = mongoose.model('chatList', chatListSchema);