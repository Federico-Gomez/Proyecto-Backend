// Configuración de Multer
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profile') {
            cb(null, `${__dirname}/../../uploads/profiles`);
        } else if (file.fieldname === 'product') {
            cb(null, `${__dirname}/../../uploads/products`);
        } else if (file.fieldname === 'document') {
            cb(null, `${__dirname}/../../uploads/documents`);
        }
    },

    filename: function (req, file, cb) {
        cb(null, `${file.fieldname} - ${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log('File being uploaded:', file);
        cb(null, true);
    }
});

module.exports = uploader;