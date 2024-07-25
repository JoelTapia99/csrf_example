const express = require("express");
const session = require("express-session");
const flash = require("connect-flash-plus");
const {v4: uuid} = require("uuid");
const cors = require("cors");
const fs = require("fs");
const {PORT} = require("./constants/config");
const {login} = require("./middlewares/oauth");
const {ROUTES} = require("./constants/routes");
const {serverRun} = require("./helpers/logs.helper");
const {SERVER_CONFIG} = require("./config/session.config");
const {User} = require("./models/user.model");
const {HANDLEBARS_CONFIG} = require("./config/handlebars.config");

// =====================================================
// ==============| START - GLOBAL CONFIG |==============
// =====================================================

const app = express();
const UserModel = new User()
const _TOKENS = new Map();

// =====================================================
// ==============| END - GLOBAL CONFIG |==============
// =====================================================

// Middlwares

// app.use(cors({
//   origin: 'http://localhost:5000',
//   credentials: true,
// }));
app.use(express.urlencoded({extended: true}));
app.use(session(SERVER_CONFIG));
app.use(flash());
app.set("views", './views');
app.engine("hbs", HANDLEBARS_CONFIG);
app.set("view engine", "hbs");
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Login

// const login = (req, res, next) => {
//   if (!req.session.userId) res.redirect("/login");
//   else next();
// };

// CSRF


const csrfToken = (sessionId) => {
    const token = uuid();
    const userTokens = _TOKENS.get(sessionId);
    userTokens.add(token);
    setTimeout(() => userTokens.delete(token), 30000);

    return token;
};

const csrf = (req, res, next) => {
    const token = req.body.csrf;

    if (!token || !_TOKENS.get(req.sessionID).has(token)) res.status(422).send("CSRF Token missing or expired");
    else next();
};


// ==============| ROUTES |==============
app.get(ROUTES.HOME, login, (req, res) => {
    res.render("landingpage");
});

app.get(ROUTES.LOGIN, (req, res) => {
    console.log(req.session);
    res.render("login", {message: req.flash("message")});
});

app.post(ROUTES.LOGIN, (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        req.flash("message", "Fill all the fields");
        return res.redirect(ROUTES.LOGIN);
    }

    const user = UserModel.findUserByEmail(email);

    if (!user || user.password !== password) {
        req.flash("message", "Invalid credentials");
        return res.redirect(ROUTES.LOGIN);
    }

    req.session.userId = user.id;
    _TOKENS.set(req.sessionID, new Set());
    console.log(req.session);
    res.redirect(ROUTES.HOME);
});

app.get(ROUTES.LOGOUT, login, (req, res) => {
    req.session.destroy();
    res.send("Logged out");
});

app.get(ROUTES.UPDATE, login, (req, res) => {
    // res.render("edit", {token: csrfToken(req.sessionID)});
    res.render("edit");
});

app.post(ROUTES.UPDATE, login, (req, res) => {
    const {email} = req.body
    console.log(req.body)
    const user = UserModel.findUserById(req.session.userId)
    console.warn(user)
    user.email = email;

    console.log(`User ${user.id} email changed to ${user.email}`);
    // fs.writeFileSync('db.json', JSON.stringify(users));

    res.send(`Email changed to ${user.email}`);
});

app.get("*", (req, res) => res.redirect(ROUTES.HOME));
// app.get("/", (req, res) => res.redirect(ROUTES.HOME));

// =====================================================
// ==============| RUN SERVER |==============
// =====================================================
app.listen(PORT, () => serverRun(PORT));
