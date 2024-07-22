const express = require('express');
const fileUpload = require('express-fileupload');
const path = require("path");
const bodyParser = require('body-parser');
const hbs = require("hbs");
const fs = require('fs');
require("./db/conn");
const app = express();
const port = process.env.PORT || 4000;

app.use(fileUpload({
    createParentPath: true
}));

// Registering helpers
hbs.registerHelper('lte', function(a, b) {
  return a <= b;
});

hbs.handlebars.registerHelper('intval', function(value) {
    return parseInt(value, 10);
});

hbs.handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

hbs.registerHelper('objectArrayContains', function(array, property, value, options) {
    const found = array.some(item => item[property] === value);
    return found ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('eq', function(a, b) {
    return a == b;
});

hbs.registerHelper('eq1', function(a, b) {
    return a === b;
});

hbs.registerHelper('neq', function(a, b) {
    return a != b;
});

hbs.registerHelper('colClass', function(num) {
    return num == 1 ? '4' : '3';
});

hbs.registerHelper('isGreaterThan', function(value, comparison, options) {
    return value > comparison ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('includes', function(array, value, options) {
    const stringValue = value.toString();
    return Array.isArray(array) && array.includes(stringValue) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('includes1', function(arr, val, options) {
    return arr.includes(val) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('isInArray', function(array, value, options) {
    return array.includes(value.toString()) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('count', function(array) {
    return array.length;
});

// Set static and views paths
const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partial_path1 = path.join(__dirname, "./views/retail_admin/partials");
const partial_path2 = path.join(__dirname, "./views/web/partials");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(static_path));

// Function to register partials from a directory
const registerPartials = (partialsPath) => {
    fs.readdirSync(partialsPath).forEach((file) => {
        const matches = /^([^.]+).hbs$/.exec(file);
        if (matches) {
            const name = matches[1];
            const template = fs.readFileSync(path.join(partialsPath, file), 'utf8');
            hbs.registerPartial(name, template);
        }
    });
};

// Register partials from both directories

registerPartials(partial_path1);
// registerPartials(partial_path2);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.get('/retail_admin', (req, res) => {

    res.render('retail_admin/views/index'); // Adjust the path to your admin template
});

app.get("/", (req, res) => {
    console.log("GET request to /");

    res.render("web/views/index");
});

const categoryRoutes = require('./routes/category');
app.use('/retail_admin', categoryRoutes);

const subcategoryRoutes = require('./routes/subcategory');
app.use('/', subcategoryRoutes);

const seoRoutes = require('./routes/home_seo');
app.use('/', seoRoutes);

const sliderRoutes = require('./routes/slider');
app.use('/', sliderRoutes);

const mobnumberRoutes = require('./routes/contact_number');
app.use('/', mobnumberRoutes);

const marqueeRoutes = require('./routes/marquee');
app.use('/', marqueeRoutes);

const brandRoutes = require('./routes/brand');
app.use('/', brandRoutes);

const sizeRoutes = require('./routes/size');
app.use('/', sizeRoutes);

const productRoutes = require('./routes/product');
app.use('/', productRoutes);

const attributeRoutes = require('./routes/attribute');
app.use('/', attributeRoutes);

const subattributeRoutes = require('./routes/subattribute');
app.use('/', subattributeRoutes);

const productviewRoutes = require('./routes/product_view');
app.use('/', productviewRoutes);

const indexviewRoutes = require('./routes/index.js');
app.use('/', indexviewRoutes);

const producteditRoutes = require('./routes/product_edit');
app.use('/', producteditRoutes);

app.listen(port, () => {
    console.log(`Server is running on port no ${port}`);
});
