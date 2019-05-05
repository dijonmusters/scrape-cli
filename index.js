const axios = require('axios');
const cheerio = require('cheerio');

// TODO: Move taste scraper to separate file
// TODO: Implement epicurious scraper
// TODO: Push to npm
// TODO: Add flag for creating a markdown file in JMFD format

const scrapeTaste = async (data) => {
  const $ = cheerio.load(data);
  const title = $('h1').text();
  const [prep, cook, servings] =  $('.recipe-cooking-infos').find('b').map((i, e) => $(e).text()).get()
  const ingredients =  $('.recipe-ingredients-section').find('.ingredient-description').map((i, e) => $(e).text()).get()
  const method =  $('.recipe-method-section').find('.recipe-method-step-content').map((i, e) => $(e).text().trim()).get()
  return {
    title,
    ingredients,
    method,
    prep,
    cook,
    servings
  }
}

const scrapeRecipe = async (url) => {
  try {
    const { data } = await axios.get(url);
    if (url.includes('taste.com.au')) { return await scrapeTaste(data); }
    console.log('cannot scrape that recipe website');
  } catch (e) {
    console.log('could not connect to that url');
  }
}

const run = async () => {
  const url = process.argv[2];
  if (url) {
    const recipe = await scrapeRecipe(url);
    recipe && console.log(recipe);
  } else {
    console.log('please provide a url to scrape');
  }
}

run();