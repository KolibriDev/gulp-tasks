
module.exports = {
  array: (a, b, fieldName = 'name') => {
    const fieldA = a[fieldName].toLowerCase()
    const fieldB = b[fieldName].toLowerCase()
    if (fieldA < fieldB) { return -1 }
    if (fieldA > fieldB) { return 1 }
    return 0
  },
}
