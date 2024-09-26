const mongoose = require('mongoose');

const CHAT_USER = new mongoose.Schema({
    cnsr_code: { type: String, required: true },
    cnsr_name: { type: String },
    cnsr_role: { type: String },
    cnsr_group: { type: String },
    cnsr_password: { type: String },
    created_at: { type: Date, default: Date.now },
    cnsr_email: { type: String },
    cnsr_phnum: { type: String },
    cnsr_loginYn: { type: String },
    id: mongoose.Schema.Types.ObjectId,
});
CHAT_USER.index({ cnsr_code: 1 });
CHAT_USER.index({ cnsr_email: 1 });

module.exports = mongoose.model('counselor', CHAT_USER);