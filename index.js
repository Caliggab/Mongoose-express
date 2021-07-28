const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');


let mongoose = require('mongoose')
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    console.log("Mongo Connection open BRO!")
    })
    .catch(err => {
    console.log("Something is fuzzy with mongo bro" + err)
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const categories = ['fruit', 'vegetable', 'dairy', 'fungi']


// INDEX
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products , category });

    }
    else {
        const products = await Product.find({});
        res.render('products/index', { products , category: 'All' });
        
    }
})

// FORM and CREATE
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`)
})

// FORM and UPDATE/EDIT
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    res.render('products/edit', { product , categories});
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    res.redirect(`/products/${product._id}`)
})

// SHOW PAGE
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', { product })
})

// DELETE

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id)
    res.redirect('/products')
})


app.listen(3000, () => {
    console.log('Listening over here on 3000 broski')
})

