const filesPath = '/files';
const File = require('../models/file');
const fs = require('fs');

module.exports.filesPath = filesPath;

module.exports.getFilePath = (filename) => `${filesPath}/${filename}`;
module.exports.getFullPath = (url) => process.env.BASE_URL + url;

module.exports.createFile = async (name,mimetype,size) => {
    const url = this.getFullPath(this.getFilePath(name));
    return File.create( {
        url,
        name,
        mimetype,
        size
    })
}

module.exports.deleteFile = async (url) => {
    return new Promise((resolve) => {
        fs.unlink(url.includes('public') ? url : 'public' + url, () => resolve());
    })
}

module.exports.getAll = async (perPage,page) => {
    const offset = perPage * (page - 1);
    const users = await File.findAll({
        limit: perPage,
        offset: offset,
    });
    const totalUsers = await File.count();
    const totalPage = Math.ceil(totalUsers / perPage) || 1;
    return {
        page,
        totalPage,
        perPage,
        totalCount: totalUsers,
        result: users,
    };
}
