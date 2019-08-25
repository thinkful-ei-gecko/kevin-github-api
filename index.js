'use strict';

const BASE_URL = 'https://api.github.com/users';

function getUser(userHandle) {
  let error;
  return fetch(`${BASE_URL}/${userHandle}/repos`)
    .then(response => {
      if (!response.ok) {
        error = { code: response.status };
        if (!response.headers.get('content-type').includes('json')) {
          error.message = response.statusText;
          return Promise.reject(error);
        }
      }
      return response.json(); 
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      } 
      return data;
    })
    .catch(error => displayError(`${error.code} ${error.message}`));
}

function displayResults(userRepos) {
  let htmlString = `
    <h2>Repos for <a href="${userRepos[0].owner.html_url}">${userRepos[0].owner.login}</a></h2>
    <ol>
  `;
  for (let i = 0; i < userRepos.length; i++) {
    htmlString += `
      <li><a href="${userRepos[i].html_url}">${userRepos[i].name}</a></li>
    `;
  }
  htmlString += `</ol>`;
  $('.js-display-results').html(htmlString);
}

function displayError(error) {
  $('.js-display-results').html(`<span style="font-weight:bold;color:red">${error}</span>`);
}

function displayNoRepos(userHandle) {
  $('.js-display-results').html(`<span style="font-weight:bold">${userHandle} has no repos!</span>`);
}

function handleSubmitClicked() {
  $('form').on('submit', event => {
    event.preventDefault();
    $('.js-display-results').empty();
    const userHandle = $('.js-input-search').val();
    getUser(userHandle)
      .then(userRepos => { 
        if (userRepos) {
          if (userRepos.length > 0) {
            displayResults(userRepos); 
          }
          else {
            displayNoRepos(userHandle);
          }
        }
      })
      .catch(error => displayError(error.message));
  });
}

$(() => {
  handleSubmitClicked();
});