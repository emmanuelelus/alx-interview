#!/usr/bin/node
const request = require('request');
const API_URL = 'https://swapi-api.hbtn.io/api';

if (process.argv.length !== 3) {
  console.error('Usage: ./script.js <film_id>');
  process.exit(1); // Exit with an error code
}

const filmId = process.argv[2];

request(`${API_URL}/films/${filmId}/`, (err, _, body) => {
  if (err) {
    console.error(err);
    process.exit(1); // Exit with an error code
  }

  try {
    const filmData = JSON.parse(body);
    const charactersURL = filmData.characters;
    
    // Use Promise.all() to fetch character names concurrently
    Promise.all(charactersURL.map(getCharacterName))
      .then(names => {
        console.log(names.join('\n'));
      })
      .catch(allErr => {
        console.error(allErr);
        process.exit(1); // Exit with an error code
      });
  } catch (parseErr) {
    console.error('Error parsing JSON response:', parseErr);
    process.exit(1); // Exit with an error code
  }
});

function getCharacterName(url) {
  return new Promise((resolve, reject) => {
    request(url, (promiseErr, __, charactersReqBody) => {
      if (promiseErr) {
        reject(promiseErr);
      } else {
        try {
          const characterData = JSON.parse(charactersReqBody);
          resolve(characterData.name);
        } catch (parseErr) {
          reject(`Error parsing character data: ${parseErr}`);
        }
      }
    });
  });
}
