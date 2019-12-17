/**
 * Convert a list of objects to an HTML table
 * @param {object[]} objList - An array of objects
 * @returns The HTML string for the table element
 */
function toHtmlTable (objList) {
  const headers = Object.keys(objList[0] || {})
  const headerRow = `<tr><th>${headers.join('</th><th>')}</th></tr>`
  const bodyRows = objList.map(o => {
    return `<tr><td>${headers.map(h => o[h]).join('</td><td>')}</td></tr>`
  })
  return `<table>
    <thead>${headerRow}</thead>
    <tbody>${bodyRows}</tbody>
  </table>`
}

module.exports = { toHtmlTable }
