const db = require("../knex");
const io = require('../socket'); 

exports.sendMessage = (req,res) => {
    const { conversationId, senderId, content } = req.body;

    const message = {
        conversationId: conversationId,
        senderId: senderId,
        content: content,
        timestamp: new Date(),
      };

      db('message')
    .insert(message)
    .then(() => {
      io.emit(`message-${conversationId}`, message);
      res.status(201).json({ message: 'Message sent successfully' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to send message' });
    });




}

exports.getMessages = (req, res) => {
    const conversationId = req.params.conversationId;
  
    db('message')
      .select('*')
      .where('conversation_id', conversationId)
      .orderBy('timestamp', 'asc')
      .then(results => {
        res.status(200).json({ messages: results });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
      });
  };