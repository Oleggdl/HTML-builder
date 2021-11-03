const fs = require('fs')
const path = require('path')
const { stdin, stdout } = require('process')
const readln  = require('readline')


const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });
const readline = readln .createInterface({ input: stdin, output: stdout })
stdout.write('Hello, enter text\n')

const exite = () => {
   stdout.write('Goodbye')
    stream.end()
    readline.close()
}

readline.on('line', chunk => {
    if (chunk !== 'exit') {
        stream.write(chunk + '\n')
    } else {
        exite()
    }
});


readline.on('SIGINT', () => {
    exite();
});