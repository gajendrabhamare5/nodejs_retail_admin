const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const cors = require('cors');

require('./db/conn');
const injectCommonData = require('./middleware/commonData');
const helpers = require('./helpers/helpers.js');
const app = express();
const port = process.env.PORT || 4000;

app.use(fileUpload({
    createParentPath: true
}));

app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cors());
let sessionStore = {};

// Registering helpers
const hbs = exphbs.create({

    extname: 'hbs',
    defaultLayout: false,
    partialsDir: [
        { dir: path.join(__dirname, 'views/web/partials'), namespace: 'web' },
        { dir: path.join(__dirname, 'views/retail_admin/partials'), namespace: 'admin' }
    ],
    helpers: {
        lte: (a, b) => a <= b, 
        lt : (a, b) => a < b,
        intval: (value) => parseInt(value, 10),
        add: (a, b) => a + b,
        objectArrayContains: (array, property, value, options) => {
            const found = array.some(item => item[property] === value);
            return found ? options.fn(this) : options.inverse(this);
        },
        eq: (a, b) => a == b,
        eq1: (a, b) => a === b,
        neq: (a, b) => a != b,
      contains: function (array, value) {
        if (!Array.isArray(array)) return false;
        return array.includes(value);
        },
        colClass: (num) => num == 1 ? '4' : '3',
        isGreaterThan: (value, comparison, options) => value > comparison ? options.fn(this) : options.inverse(this),
        includes: (array, value, options) => {
            const stringValue = value.toString();
            return Array.isArray(array) && array.includes(stringValue) ? options.fn(this) : options.inverse(this);
        },
        includes1: (arr, val, options) => arr.includes(val) ? options.fn(this) : options.inverse(this),
        isInArray: (array, value, options) => array.includes(value.toString()) ? options.fn(this) : options.inverse(this),
        count: (array) => array.length,
        product_design: helpers.product_design
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const static_path = path.join(__dirname, './public');
app.use(express.static(static_path));

app.use(injectCommonData);

// hbs.registerHelper('product_design', helpers.product_design);

// Define routes
app.get('/retail_admin', (req, res) => {
    res.render('retail_admin/views/index', { layout: false });
});

// app.get('/', (req, res) => {
//     res.render('web/views/index', { layout: false });
// });


const indexviewRoutes = require('./routes/routes.js');
app.use('/', indexviewRoutes);


app.listen(port, () => {
    console.log(`Server is running on port no ${port}`);
});
