// Configuración de Multer
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../files`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '__test'); // agrega __test al nombre de los archivos
    }
});

const uploader = multer({ storage });

module.exports = uploader;