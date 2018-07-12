// Core dependencies
const path = require('path');


// NPM dependencies
const express = require('express');
const nunjucks = require('nunjucks');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const fileHelper = require('./app/utils/file-helper');
const NunjucksCodeHighlight = require('nunjucks-highlight.js');
const hljs = require('highlight.js');
const highlight = new NunjucksCodeHighlight(nunjucks, hljs);

// Routing
const routes = require('./app/routes/index');
const autoRoutes = require('./app/routes/auto');


const app = express();


// Setup application
const appViews = [
  path.join(__dirname, '/node_modules/govuk-frontend/'),
  path.join(__dirname, '/node_modules/govuk-frontend/components'),
  path.join(__dirname, '/node_modules/@hmcts/frontend/'),
  path.join(__dirname, '/node_modules/@hmcts/frontend/components'),
  path.join(__dirname, 'app/views'),
  path.join(__dirname, 'app/views/components'),
  path.join(__dirname, 'app/views/layouts'),
  path.join(__dirname, 'app/views/partials'),
  path.join(__dirname, 'app/components')
];

// Configurations
const nunjucksEnvironment = nunjucks.configure(appViews, {
  autoescape: true,
  express: app,
  noCache: true,
  watch: true
});

nunjucksEnvironment.addGlobal('getNunjucksCode', fileHelper.getNunjucksCode);
nunjucksEnvironment.addGlobal('getHtmlCode', fileHelper.getHtmlCode);
nunjucksEnvironment.addExtension('NunjucksCodeHighlight', highlight);

// Set view engine
app.set('view engine', 'html');


// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/assets', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend', 'assets')));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@hmcts/frontend/assets')));


// Use routes
app.use(routes);
app.use(autoRoutes);


const renderer = new marked.Renderer();

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pendantic: true,
  sanitize: false,
  smartLists: true,
  smartypants: true
});


// markdown register
markdown.register(nunjucksEnvironment, marked);

// Start app on port 3000
app.listen(3000, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Listening on port 3000!');
  }
});


module.exports = app;
