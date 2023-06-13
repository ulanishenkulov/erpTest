const fs = require('fs');
const multer = require('multer');

module.exports = (path) => {
    if (!fs.existsSync('public')) {
        fs.mkdirSync('public')
    }
    if (!fs.existsSync(`public${path}`)) {
        fs.mkdirSync(`public${path}`)
    }

    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public' + (path ? path : ''))
            },
            filename: function (req, file, cb) {
                cb(null, `${Date.now() + Math.random()}.${file.originalname.split('.').pop()}`)
            },
        })
    })
}
