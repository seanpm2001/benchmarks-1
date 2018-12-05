'use strict'

const fs = require('fs')
const { build } = require('./schema/results')
const fixtures = require('./lib/fixtures')
const run = require('./lib/runner')

async function localExtract (node, name, subtest, fileSet, version) {
  try {
    const fileStream = fs.createReadStream(fixtures[fileSet])
    const peer = node[0]
    const inserted = await peer.files.add(fileStream)
    const start = process.hrtime()
    const validCID = inserted[0].hash
    await peer.files.get(validCID)
    const end = process.hrtime(start)
    return build({
      name: name,
      subtest: subtest,
      file: fixtures[fileSet],
      meta: { version: version },
      description: 'Get file to local repo',
      testClass: fileSet,
      duration: { s: end[0],
        ms: end[1] / 1000000 }
    })
  } catch (err) {
    throw Error(err)
  }
}
run(localExtract)
