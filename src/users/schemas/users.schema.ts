import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
    seqNo: Number,
    //_id: mongoose.Schema.Types.ObjectId, Commented to avoid document-must-have-an-id-before-saving
    name: String,
    last_login: Date,
    online: Boolean
});
