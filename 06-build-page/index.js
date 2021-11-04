const fs = require('fs')
const path = require('path')
const promises = fs.promises


const template = path.join(__dirname, 'template.html')
const prodectDist = path.join(__dirname, 'project-dist')
const pathComponents = path.join(__dirname, 'components')
const pathDirCopy = path.join(prodectDist, 'assets')
const pathDir = path.join(__dirname, 'assets')
const stylesPath = path.join(__dirname, 'styles');

const streamTemplate = fs.createReadStream(template, 'utf-8')
const streamDist = fs.createWriteStream(path.join(prodectDist, 'index.html'))
let text = ''

const createDir = () => {
    fs.mkdir(prodectDist, { recursive: true }, err => {
        if (err) {
            throw err
        }
    })
}
createDir()

const creatFile = () => {
    streamTemplate.on('data', chunk => {
        text = chunk.toString()
    })
    fs.readdir(pathComponents, { withFileTypes: true }, (err, data) => {
        if (err) {
            throw err.message
        }

        const array = []
        data.forEach(arr => {
            const name = arr.name.match(/([\w]*\.)*/)[0].replace('.', '');
            array.push(`{{${name}}}`)
        })
        promises.readdir(pathComponents).then(res => {
            res.forEach((a, i) => {
                const read = fs.createReadStream(path.join(pathComponents, a), 'utf-8')
                read.on('data', chunk => {
                    text = text.replace(array[i], chunk)
                    if (!array.find(arr => text.includes(arr))) {
                        streamDist.write(text)
                    }
                })
            })
        })
    })
}

creatFile()

const assetsCopy = () => {
    fs.mkdir(pathDirCopy, { recursive: true }, err => {
        if (err) {
            throw err
        }
    })
    const copyFiles = async (startPath, copyPath) => {
        await promises.readdir(startPath, { withFileTypes: true }).then(files => {
            files.forEach(async file => {
                if (file.isDirectory()) {
                    copyFiles(path.join(startPath, file.name), path.join(copyPath, file.name));
                } else {
                    fs.mkdir(copyPath, { recursive: true }, err => {
                        if (err) {
                            throw err
                        }
                    })
                    promises.copyFile(path.join(startPath, file.name), path.join(copyPath, file.name));
                }
            })
        })
    }
    copyFiles(pathDir, pathDirCopy)
}
assetsCopy()


const stylesCopy = () => {
    const stylePathCopy = fs.createWriteStream(path.join(prodectDist, 'style.css'));
    promises.readdir(stylesPath).then(async files => {
        files.forEach(async file => {
            const filePath = path.join(stylesPath, file);
            const name = path.basename(filePath);
            const ext = path.extname(filePath);
            if (ext === '.css') {
                const input = fs.createReadStream(path.join(stylesPath, name));
                input.on('data', chunk => {
                    stylePathCopy.write('\n' + chunk.toString() + '\n');
                });
            }
        });
    });
}

stylesCopy()