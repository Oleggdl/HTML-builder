const fs = require('fs')
const promises = fs.promises
const path = require('path')

const srcDir = path.join(__dirname, 'styles')
const output = path.join(__dirname, 'project-dist', 'bundle.css')


const merge = () => {
    const sream = fs.createWriteStream(output)
    promises.readdir(srcDir, {
        withFileTypes: true, encoding: 'utf-8'
    }).then(files => {
        files.forEach(file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                let result = fs.createReadStream(path.join(srcDir, file.name), 'utf-8')
                result.on('data', data => sream.write(data))
            }
        });
    })

}

merge()
