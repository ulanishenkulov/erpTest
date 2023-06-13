const fileService = require("../services/fileServices");
const File = require('../models/file')

module.exports.uploadFile = async (req, res, next) => {
    try {
        const { filename, mimetype, size } = req.file;
        const file = await fileService.createFile(filename,mimetype,size);
        return res.json(file);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports.getAllFiles = async (req, res, next) => {
    try {
        const { perPage = 10, page = 1, } = req.query;
        const responseData = await fileService.getAll(perPage, page);
        return res.json(responseData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports.getFileById = async (req,res,next) => {
    try {
        const file = (await File.findByPk(req.params.id));

        if (!file) {
            return res.status(404).send({message:"Not Found"});
        }
        file.get();
        return res.json(file);
    }catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports.getFileFullPath = async (req,res,next) => {
    try {
        const file = (await File.findByPk(req.params.id)).get();
        if (!file) {
            return res.status(404).send({message:"Not Found"});
        }
        file.get();
        return res.json({fullPath:file.url});
    }catch (err) {
        return res.status(500).json({ error: err.message });
    }

}

module.exports.deleteFile = async (req,res,next) => {
    const { id } = req.params;

    if(!id) {
        return res.status(404).send({message:"fileId required"});
    }

    try {
        const file = (await File.findByPk(id));
        if (!file) {
            return res.status(404).send({message:"Not Found"});
        }
        file.get()
        await fileService.deleteFile(fileService.getFilePath(file.name));
        await File.destroy({ where: { id } });
        return res.json({message: "file is deleted"});
    }catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports.updateFile = async (req,res,next) => {
    const { id } = req.params;
    const { file = null } = req;


    if (!id && !file) {
        return res.status(404).send({message:"fileId or file is required"});
    }
    try {
        const oldFile = (await File.findByPk(id));

        if (!oldFile) {
            return res.status(404).send({message:"Not Found"});
        }
        oldFile.get();
        await fileService.deleteFile(fileService.getFilePath(oldFile.name));
        const newUrl = fileService.getFullPath(fileService.getFilePath(file.filename));
        const [affectedRows] = await File.update(
            { name: file.filename, url: newUrl },
            { where: { id } }
        );

        if (affectedRows === 0) {
            return res.status(404).send({ message: "File not found" });
        }
        const updatedFile = await File.findByPk(id);
        return res.json(updatedFile);
    }catch (err) {
        return res.status(500).json({ error: err.message });
    }
}