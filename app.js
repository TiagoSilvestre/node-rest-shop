const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://tiago:a1b2c3d4@node-rest-api-shop-shard-00-00-zthpa.mongodb.net:27017,node-rest-api-shop-shard-00-01-zthpa.mongodb.net:27017,node-rest-api-shop-shard-00-02-zthpa.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-api-shop-shard-0&authSource=admin');
/*

ESTOUU AQUII!!!
https://www.youtube.com/watch?v=3p0wmR973Fw&index=9&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q
*/
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
