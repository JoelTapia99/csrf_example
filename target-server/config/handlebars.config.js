const handlebars = require("express-handlebars");

const HANDLEBARS_CONFIG = handlebars({
    defaultLayout: "main",
    layoutsDir: `${__dirname}/../views`,
    extname: ".hbs",
})

module.exports = {HANDLEBARS_CONFIG}
