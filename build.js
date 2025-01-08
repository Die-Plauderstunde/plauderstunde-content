const fs = require('fs')

const discussionTopicsDir = './discussion-topics'

function main() {
    const topics = fs.readdirSync(discussionTopicsDir).filter(path => isTopicFile(path)).map(path => parseTopic(path))
    fs.writeFileSync('public/topics.json', JSON.stringify(topics, null, 4))
}

function isTopicFile(fileName) {
    return !!/[\d]{3}__[\w-]+\.txt/.exec(fileName)
}

function parseTopic(fileName) {
    const id = parseInt(/(^[\d]+)/.exec(fileName)[0], 10)
    const path = `${discussionTopicsDir}/${fileName}`
    const content = fs.readFileSync(path).toString()
    const parts = []
    const lines = content.split('\n')
    let part = {
        level: 0,
        title: '',
        content: '',
    }
    for(let line of lines) {
        if(/^[#]/.exec(line)) {
            let value = line.replace(/^[#]+/g, '').trim()
            let level = /^[#]+/.exec(line)[0].length
            part = {
                level,
                title: value,
                content: ''
            }
            parts.push(part)
        } else {
            if(line) {
                part.content += line + '\n'
            }
        }
    }
    const part1 = parts.find(part => part.level === 1)

    if(!part1) {
        throw new Error(`In ${path}: missing heading/content`)
    }

    return {
        id,
        title: part1.title,
        description: part1.content
    }
}

main()