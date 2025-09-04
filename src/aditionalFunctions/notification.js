const { getIO } = require('../config/webSocket');
const User = require("../models/user");
const Post = require("../models/post");

async function socketNotification ({ id, postId, from }) {
    const sender = await User.findById(from);
    const post = await Post.findById(postId);

    getIO().to(id).emit('new notification', { // Le envío estos datos al socket con el id del destinatario
          postId: { 
            _id: post._id, 
            description: post.description 
          },
          from: { 
            _id: sender._id, 
            userName: sender.userName,
            fullName: sender.fullName,
            avatar: sender.avatar,
          },
          toUserId: id,   // Campo necesario para el socket
          date: Date()
    });  
}

module.exports = socketNotification;