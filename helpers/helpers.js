const handlebars = require('handlebars');

handlebars.registerHelper('lte', function(a, b) {
    return  a <= b
  });

  handlebars.registerHelper('eq', function (a, b) {
      return a == b
  });

  handlebars.registerHelper('eq1', function (a, b) {
      return a === b;
  });

  handlebars.registerHelper('neq', function (a, b) {
      return a != b;
  });

  handlebars.registerHelper('colClass', function(num) {
      return num == 1 ? '4' : '3';
    });

    handlebars.registerHelper('isGreaterThan', function (value, comparison, options) {
      if (value > comparison) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  });

    handlebars.registerHelper('includes', function (array, value, options) {
      const stringValue = value.toString();
      if (Array.isArray(array) && array.includes(stringValue)) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  });

  handlebars.registerHelper('isInArray', function (array, value, options) {
      if (array.includes(value.toString())) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  });

  handlebars.registerHelper('count', function (array) {
      return array.length;
  });

  module.exports = handlebars;