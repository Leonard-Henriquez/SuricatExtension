import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import handlers from './modules/handlers';
import msg from './modules/msg';
// import runner from './modules/runner';

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

const onClick = (e) => {
  e.preventDefault();
  console.log('click');
  const credentials = {
    email: 'test@test.com',
    password: '123456'
  };
  message.bg('authenticate', credentials);
};

const checkLoginStatus = (isLogged) => {
  console.log(isLogged);
  if (isLogged) {
    console.log('Logged');
    $('#authenticate').hide();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      message.bcast(tabs[0].id, ['ct'], 'getContent', tabs[0].url);
    });

    // createOpportunity(userCredentials);
  } else {
    console.log('Not logged');
    $('#authenticate').show();
  }
};

const popupHandlers = {
  isLogged: (isLogged) => {
    checkLoginStatus(isLogged);
  }
};

const message = msg.init('popup', popupHandlers);

$(document).on('click', '#authenticate', onClick);
