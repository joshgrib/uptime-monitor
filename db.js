const fs = require('fs')

const dbFilePath = './TEMP_DB.json'

/**
 * Save state data
 * @param {object[]} state - The JSON data to save in the file
 */
function save (state) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(state))
  } catch (err) {
    console.error(err)
  }
}
/**
 * Load state data
 */
function load (defaultData) {
  try {
    if (!fs.existsSync(dbFilePath)) {
      save(defaultData)
      return defaultData
    }
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'))
  } catch (err) {
    console.error(err)
    return defaultData
  }
}

module.exports = {
  save,
  load
}
