
/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {float} a random floating point number
 */
module.exports = (min, max) => Math.random() * (max - min) + min

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
module.exports.int = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
