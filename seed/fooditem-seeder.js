var Fooditem = require('../models/Fooditem');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/olfos3');

var fooditems = [
    new Fooditem({
        name: 'big breakfast',
        description: 'full irish breakfast',
        calories: '789',
        price: '6.99',
        img_url: 'images/FFF.png'
    }),
    new Fooditem({
        name: 'big breakfast',
        description: 'full irish breakfast',
        calories: '789',
        price: '6.99',
        img_url: 'images/FFF.png'
    }),
    new Fooditem({
        name: 'big breakfast',
        description: 'full irish breakfast',
        calories: '789',
        price: '6.99',
        img_url: 'images/FFF.png'
    }),
    new Fooditem({
        name: 'big breakfast',
        description: 'full irish breakfast',
        calories: '789',
        price: '6.99',
        img_url: 'images/FFF.png'
    }),
    new Fooditem({
        name: 'big breakfast',
        description: 'full irish breakfast',
        calories: '789',
        price: '6.99',
        img_url: 'images/FFF.png'
    })
];

var done = 0;
for (var i = 0; i < fooditems.length; i++) {
    fooditems[i].save(function(err, result) {
        done++;
        if (done === fooditems.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}