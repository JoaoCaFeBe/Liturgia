const toAllFirstCase = (str) => {
    return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

module.exports = { toAllFirstCase };