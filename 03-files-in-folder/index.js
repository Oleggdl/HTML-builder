const fs = require('fs')
const promises = fs.promises
const path = require('path')
const { stdout } = process;

promises.readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true, encoding: 'utf-8'
}).then(files => {
    files.forEach(file => {
        if (!file.isDirectory()) {
            const filePath = path.join(__dirname, 'secret-folder', file.name)
            const fileExtname = path.extname(filePath)
            const fileName = path.basename(filePath, fileExtname)
            promises.stat(filePath).then(result => {
                stdout.write(`${fileName} - ${fileExtname.replace('.', '')}  - ${Number(result.size/2000)}kb\n`)
            })
        }
    });
})