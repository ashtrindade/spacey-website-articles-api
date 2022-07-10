const PORT  = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()

const categories = [
    {
        name: 'acessibilidade',
        address: 'https://lgbtqspacey.com/category/acessibilidade/',
        base: ''
    },
    {
        name: 'atracao',
        address: 'https://lgbtqspacey.com/category/atracao/',
        base: ''
    },
    {
        name: 'genero',
        address: 'https://lgbtqspacey.com/category/genero/',
        base: ''
    },
    {
        name: 'guias',
        address: 'https://lgbtqspacey.com/category/guias/',
        base: ''
    },
    {
        name: 'historia',
        address: 'https://lgbtqspacey.com/category/historia/',
        base: ''
    },
    {
        name: 'neurodivergencia',
        address: 'https://lgbtqspacey.com/category/neurodivergencia/',
        base: ''
    },
    {
        name: 'raca',
        address: 'https://lgbtqspacey.com/category/raca/',
        base: ''
    },
    {
        name: 'sexualidade',
        address: 'https://lgbtqspacey.com/category/sexualidade/',
        base: ''
    },
    {
        name: 'indicacao',
        address: 'https://lgbtqspacey.com/category/spacey-indica/',
        base: ''
    },
]

const articles = []

categories.forEach(category => {
    axios.get(category.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

         $('a[rel=bookmark]:contains("")', html).each(function () {
               const title = $(this).text()
               const url = $(this).attr('href')

                articles.push({
                    title,
                    url: category.base + url,
                    category: category.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Bem vinde à API de artigos da Spacey')
})

app.get('/blog', (req, res) => {
    res.json(articles)
})

app.get('/blog/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId

    const categoryAddress = categories.filter(category => category.name == categoryId)[0].address
    const categoryBase = categories.filter(category => category.name == categoryId)[0].base


    axios.get(categoryAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a[rel=bookmark]:contains("")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: categoryBase + url,
                    category: categoryId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))