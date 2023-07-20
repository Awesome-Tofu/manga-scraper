const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const mangaTitle = req.query.mangatitle;
  const chapterNum = req.query.chapter; 
  const searchUrl = `https://mangareader.to/search?keyword=${encodeURIComponent(mangaTitle)}`;

  axios.get(searchUrl)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const searchResults = [];

      $('.manga-name a').each((index, element) => {
        const title = $(element).text();
        const url = $(element).attr('href');
        let fullUrl = `https://mangareader.to${url}`;

        if (chapterNum) {
          fullUrl = `https://mangareader.to/read${url}/en/chapter-${chapterNum}`;
        }

        // Extract poster image URL
        const posterImg = $(element).closest('.item-spc').find('.manga-poster-img').attr('src');

        const mangaObject = {
          title,
          url: fullUrl,
          posterImg
        };

        searchResults.push(mangaObject);
      });

      res.json(searchResults);
    })
    .catch(error => {
      console.error('Error occurred while searching for manga titles:', error);
      res.status(500).json({ error: 'Failed to search for manga titles' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
