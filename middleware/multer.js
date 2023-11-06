const multer = require('multer');

const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

module.exports = upload;
