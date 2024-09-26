const mongoose = require('mongoose');
// 아래와 같이 작성한 기준으로 데이터를 DB에 넣기 전에 먼저 검사합니다.
// required는 필수입력, default는 기본값
// 방번호, 유저ID에 복합인덱스로 걸음 
const chatMessageSchema = new mongoose.Schema({
    chat_message : { type: String, required: true,},
    chat_id : { type: String, require: true},
    send_user: { type: String, required: true},
    sent_at: { type: Date, default: Date.now },
    cnsr_code: {type:String, require: true}
});
chatMessageSchema.index({userId: 1, roomId: 1});

module.exports = mongoose.model('chatMessage', chatMessageSchema);