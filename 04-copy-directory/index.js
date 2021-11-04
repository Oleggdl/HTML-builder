const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const srcDir = path.join(__dirname, 'files')
const destDir = path.join(__dirname, 'files-copy')


const copyDirectory = () => {

    fs.access(destDir, (error) => {
        if (error) {
            fsPromises.mkdir(destDir, { recursive: true })
                .catch(error => console.log(error));
        }

        fsPromises.readdir(srcDir, { withFileTypes: true })
            .then(res => {
                res.forEach(e => {
                    fsPromises.copyFile(path.join(srcDir, e.name), path.join(destDir, e.name))
                })
            })
            .catch(error => console.log(error))
    })
}


copyDirectory()
