const urlInput = document.querySelector('.apiInput');
let output = document.querySelector('.output');
const shortenBtn = document.querySelector('.shortenBtn');
const clearBox = document.querySelector('.clear');
const clearData = document.querySelector('.clear--btn');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

let html = '';
let dataArr = localStorage.getItem('shortLinks') ? JSON.parse(localStorage.getItem('shortLinks')) : [];
output.innerHTML = dataArr;

//Functionality to render the shortened LInk on the web
const renderShortUrl = function (data) {
  html = `<div class="output--display d-flex justify-content-between align-items-center" id="outputBox">
  <div class="output--display__left col-12 col-md-5 text-truncate">
  ${urlInput.value}
  </div>
  <div class="output--display__right d-flex justify-content-end align-items-center col-md-4">
    <p class="outputLink">${data.data}</p>
    <div class="output--display__right--btn copyBtn">copy</div>
  </div>
</div>`;

  dataArr.push(html);
  localStorage.setItem('shortLinks', JSON.stringify(dataArr));
  output.innerHTML = JSON.parse(localStorage.getItem('shortLinks'));
};

//Functionality to show ClearBtn if the localStorage is not empty
const showClearBtn = function () {
  if (localStorage.getItem('shortLinks') === null) {
    clearBox.classList.add('hidden');
  } else {
    clearBox.classList.remove('hidden');
  }
};

//Functionality to Clear data from the local storage and from the web
clearData.addEventListener('click', function () {
  localStorage.clear();
  dataArr = [];
  output.innerHTML = '';
  clearBox.classList.add('hidden');
  document.querySelector('.stats--content').style.marginTop = '0';
});

const showLoader = function () {
  loader.classList.remove('hidden');
};

const hideLoader = function () {
  loader.classList.add('hidden');
};

const RenderError = function (msg) {
  urlInput.value = '';
  error.style.transform = 'translateX(0)';
  error.innerHTML = `${msg} <img src="images/exclamation-triangle-fill.svg" alt="">`;
  setTimeout(function () {
    error.style.transform = 'translateX(10rem)';
    error.innerHTML = ``;
    hideLoader()
  }, 3000)};

//Functionality to fetch data from the API
const getShortUrl = async function (longURL) {
  try {
    showLoader();
    const res = await fetch(
      `https://www.shareaholic.com/v2/share/shorten_link?apikey=8943b7fd64cd8b1770ff5affa9a9437b&url=${longURL}&service[name]=1e4ee1833712898b646072aab0ed9fc28f7af487`
    );
    if (!res.ok) throw new Error('Could not create url');
    hideLoader();
    const data = await res.json();
    renderShortUrl(data);
    clearBox.classList.remove('hidden');
    document.querySelector('.stats--content').style.marginTop = '-4rem';
    urlInput.value = '';
  } catch (err) {
    console.log('error', err);
    RenderError(err.message);
  }
};

//Funcrtionality to show the shortened URL when click
shortenBtn.addEventListener('click', function (e) {
  e.preventDefault();
  getShortUrl(urlInput.value);
  showClearBtn();
});

//Copy Shorten Link Functionality
output.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('copyBtn')) {
    const copyBtn = e.target;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.backgroundColor = 'hsl(260, 8%, 14%)';
    const copyText = e.target.previousElementSibling.textContent;
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    setTimeout(function () {
      copyBtn.textContent = 'copy';
      copyBtn.style.backgroundColor = 'hsl(180, 66%, 49%)';
    }, 2000);
  }
});

window.addEventListener('load', () => {
  if (localStorage.getItem('shortLinks') === null) {
    document.querySelector('.stats--content').style.marginTop = '0';
  } else {
    document.querySelector('.stats--content').style.marginTop = '-4rem';
  }
  showClearBtn();
  console.log('page is fully loaded');
});
