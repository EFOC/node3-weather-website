const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Setup pages
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Eduardo'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ed'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text',
        name: 'Ed'
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Provide an address'
        })    
    }   

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        console.log(location);
        if(error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (forecastError, forecastResponse) => {
            if(forecastError) {
                return res.send({ forecastError });
            }
            res.send({
                forecast: forecastResponse,
                location,
                address: req.query.address
            })
            console.log(forecastResponse);
        })
    })
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found!'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found!',
        name: 'ed'
    });
});


app.listen(3000, () => {
    console.log('Server is up on port 3000');
});