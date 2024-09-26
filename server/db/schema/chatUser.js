const mongoose = require('mongoose');
// 아래와 같이 작성한 기준으로 데이터를 DB에 넣기 전에 먼저 검사합니다.
// required는 필수입력, default는 기본값
// 방번호, 유저ID에 복합인덱스로 걸음 
const chatUserSchema = new mongoose.Schema({
    cnsr_code: { type: String, required: true },
    cnsr_name: { type: String, required: true },
    cnsr_password: { type: String, required: true },
    cnsr_email : { type: String, required: true },
    cnsr_password : { type: String, require: true },
    cnsr_phnum: { type: String },
    cnsr_img: { type: String, requirde: false},
    created_at : { type: Date, default: Date.now },
    cnsr_loginYn: { type: String },
    login_at : { type: Date },
    id: mongoose.Schema.Types.ObjectId,
});
chatUserSchema.index({cnsr_code: 1});

module.exports = mongoose.model('chatUser', chatUserSchema);