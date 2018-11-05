import $ from 'jquery';
// import handlers from './modules/handlers';
import msg from './modules/msg';

// here we use SHARED message handlers, so all the contexts support the same
// commands. but this is NOT typical messaging system usage, since you usually
// want each context to handle different commands. for this you don't need
// handlers factory as used below. simply create individual `handlers` object
// for each context and pass it to msg.init() call. in case you don't need the
// context to support any commands, but want the context to cooperate with the
// rest of the extension via messaging system (you want to know when new
// instance of given context is created / destroyed, or you want to be able to
// issue command requests from this context), you may simply omit the
// `handlers` parameter for good when invoking msg.init()

console.log('CONTENT SCRIPT WORKS!'); // eslint-disable-line no-console

const scrapContent = (url) => {
  const basisSelector = '.job-offer-container';
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
    data[k] = $(`${basisSelector} ${v}`).html();
  });

  $(`${basisSelector} .job-offer-details > ul > li`).each((i, e) => {
    title = $(e).children('h6').text();
    content = $(e).children('p').text();
    if (title === 'Start date') {
      data.start_date = content;
    } else if (title === 'Related jobs') {
      data.job_title = content;
    } else if (title === 'Business type') {
      data.company_structure = content;
    }
  });

  data.image = $('meta[property="og:image"]').attr('content');

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


const contentHandlers = {
  getContent: (url) => {
    console.log(`Scrapping "${url}"...`);
    const data = scrapContent(url);
    message.bg('createOpportunity', data);
  }
};

const message = msg.init('ct', contentHandlers);
