import $ from 'jquery';

const basisSelector = '.job-offer-container';

const scrapContent = (url) => {
  if ($(basisSelector).length === 0) {
    console.log('No opportunity found on the page');
    return false;
  }

  const data = { url };
  let title;
  let content;

  const cssSelectors = {
    title: '.job-offer-top--title',
    company_name: '.job-offer-top--company-name',
    contract_type: '.job-offer-top--infos span:nth-child(1)',
    location: '.job-offer-top--infos span:nth-child(2)',
    job_description: '.job-offer-container--text',
  };

  $.each(cssSelectors, (k, v) => {
    content = $(`${basisSelector} ${v}`);
    if (content) {
      data[k] = content.html();
    }
  });

  $(`${basisSelector} .job-offer-details > ul > li`).each((i, e) => {
    title = $(e).children('h6').text();
    content = $(e).children('p').text();
    if (title === 'Start date') {
      data.start_date = content;
    } else if (title === 'Related jobs') {
      data.job_name = content;
    } else if (title === 'Business type') {
      data.company_structure = content;
    } else if (title === 'Industries') {
      data.sector_name = content;
    }
  });

  data.logo = $('meta[property="og:image"]').attr('content');

  const regexes = {
    salary: /\d[ \d]{1,5}(?:,\d{2})?[€$£]|[$£][ ,\d]{2,6}(?:.\d{2})?/,
    email: /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/
  };

  $.each(regexes, (k, v) => {
    content = v.exec(data.job_description);
    if (content) {
      data[k] = content[0];
    }
  });

  console.log(data);
  return data;
};

const scrapper = { scrapContent, basisSelector };

export default scrapper;
