const express = require('express')
const fileUpload = require('express-fileupload');
const path = require("path")
const bodyParser = require('body-parser')
const hbs = require("hbs")
const handlebars = require('handlebars');
require("./db/conn")
// const exphbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 4000;

app.use(fileUpload({
    createParentPath: true
}));

/* handlebars.registerHelper('concat', function () {
    let args = Array.prototype.slice.call(arguments, 0, -1);
    return args.join('');
}); */

hbs.registerHelper('lte', function(a, b) {
  return  a <= b
});

hbs.handlebars.registerHelper('intval', function(value) {
    return parseInt(value, 10);
});

hbs.handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

hbs.registerHelper('objectArrayContains', function(array, property, value, options) {
    // Check if any object in the array has the specified property with the given value
    const found = array.some(item => item[property] === value);

    if (found) {
        return options.fn(this);
    } else {
        // Otherwise, execute the {{else}} block if provided
        return options.inverse(this);
    }
});

// Register the 'eq' helper
hbs.registerHelper('eq', function (a, b) {
    return a == b
});

hbs.registerHelper('eq1', function (a, b) {
    return a === b;
});

hbs.registerHelper('neq', function (a, b) {
    return a != b;
});

hbs.registerHelper('colClass', function(num) {
    return num == 1 ? '4' : '3';
  });

  hbs.registerHelper('isGreaterThan', function (value, comparison, options) {
    if (value > comparison) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

  hbs.registerHelper('includes', function (array, value, options) {
    const stringValue = value.toString();
    /* console.log('Checking if', stringValue, 'is in', array); */

    if (Array.isArray(array) && array.includes(stringValue)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('includes1', function(arr, val, options) {
    return arr.includes(val) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('isInArray', function (array, value, options) {
    if (array.includes(value.toString())) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('count', function (array) {
    return array.length;
});

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")
const partial_path = path.join(__dirname, "./templates/partials")


 const template_path1 = path.join(__dirname, "./web/views")
 const partial_path1 = path.join(__dirname, "./web/partials")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(static_path))

// app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }));
// app.use("/retail_admin")
app.set("view engine", "hbs")
app.set("views", template_path1)
hbs.registerPartials(partial_path1)


app.get("/", (req, res) => {
    console.log("GET request to /");
    res.render("index")
})


const categoryRoutes = require('./routes/category');
app.use('/retail_admin',categoryRoutes)

const subcategoryRoutes = require('./routes/subcategory');
app.use('/',subcategoryRoutes)

const seoRoutes = require('./routes/home_seo');
app.use('/',seoRoutes)

const sliderRoutes = require('./routes/slider');
app.use('/',sliderRoutes)

const mobnumberRoutes = require('./routes/contact_number');
app.use('/',mobnumberRoutes)

const marqueeRoutes = require('./routes/marquee');
app.use('/',marqueeRoutes)

const brandRoutes = require('./routes/brand');
app.use('/',brandRoutes)

const sizeRoutes = require('./routes/size');
app.use('/',sizeRoutes)

const productRoutes = require('./routes/product');
app.use('/',productRoutes)

const attributeRoutes = require('./routes/attribute');
app.use('/',attributeRoutes)

const subattributeRoutes = require('./routes/subattribute');
app.use('/',subattributeRoutes)

const productviewRoutes = require('./routes/product_view');
app.use('/',productviewRoutes)

/*   const producteditdetailRoutes = require('./routes/product_edit_detail_fetch');
 app.use('/',producteditdetailRoutes)  */


const producteditRoutes = require('./routes/product_edit');
app.use('/',producteditRoutes)

/* app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log(`Request body:`, req.body);
    next();
}); */

app.listen(port, () => {
    console.log(`Server is running on port no ${port}`);
})