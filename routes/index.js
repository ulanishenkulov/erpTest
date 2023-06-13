const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const fileController = require('../controllers/file-controller');
const authMiddleware = require('../middleware/auth');
const { filesPath } = require('../services/fileServices');
const multer = require('../services/multer-service');
const upload = multer(filesPath);

router.post('/users/signup', userController.signUp);
router.post('/users/signin', userController.signIn);
router.post('/users/signin/new_token',authMiddleware, userController.createNewAccessToken);
router.post('/users/logout',authMiddleware, userController.logOut);
router.get('/users/info',authMiddleware, userController.getUserEmail);
router.post('/file/upload',authMiddleware,upload.single('file'), fileController.uploadFile);
router.get('/file/:id',authMiddleware,fileController.getFileById);
router.get('/file/download/:id',authMiddleware,fileController.getFileFullPath);
router.put('/file/update/:id',authMiddleware, upload.single('file'), fileController.updateFile);
router.delete('/file/delete/:id',authMiddleware, fileController.deleteFile);
router.get('/file',authMiddleware, fileController.getAllFiles);

module.exports = router;
