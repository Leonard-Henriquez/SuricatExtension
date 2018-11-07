// import handlers from './modules/handlers';
import msg from './modules/msg';
import scrapper from './modules/scrapper';

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

console.log('CONTENT SCRIPT WORKS!');

const contentHandlers = {
  isContentValid: () => {
    console.log('Checking content...');
    const isValid = ($(scrapper.basisSelector).length > 0);
    if (isValid) {
      console.log('Opportunity found on the page');
    } else {
      console.log('No opportunity found on the page');
    }
    message.bcast(['popup'], 'isValidOpportunity', isValid);
  },
  getContent: (url, stars) => {
    console.log(`Scrapping "${url}"...`);
    const data = scrapper.scrapContent(url, stars);
    if (data) {
      message.bg('createOpportunity', data);
    } else {
      message.bcast(['popup'], 'notValidOpportunity');
    }
  }
};

const message = msg.init('ct', contentHandlers);
