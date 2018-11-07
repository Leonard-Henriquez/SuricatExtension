// import runner from './modules/runner';
import $ from 'jquery';
import './app';
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

let previousStatus;
let status = undefined;

let loggedIn = false;

// -1 not valid opportunity
//  0 not logged in
//  1 ask for rating
//  2 thx message

const askToAuthenticate = (e) => {
  e.preventDefault();
  console.log('click');
  displayMessage('Wrong email or password', false, true);
  const credentials = {
    email: $('#email').val(),
    password: $('#password').val()
  };
  message.bg('authenticate', credentials);
};

const askToCheckContent = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    message.bcast(tabs[0].id, ['ct'], 'isContentValid');
  });
};

const askToScrapContent = (e) => {
  e.preventDefault();
  const stars = parseInt(e.currentTarget.id);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    message.bcast(tabs[0].id, ['ct'], 'getContent', tabs[0].url, stars);
  });
};

const displayMessage = (text, showRating = false, showLogin = false) => {
  if (showRating) {
    $('#rating').show();
  } else {
    $('#rating').hide();
  }
  if (showLogin) {
    $('#authentication-form').show();
  } else {
    $('#authentication-form').hide();
  }

  $('#message-content').text(text);
  if (text !== '') {
    $('#message').show();
  } else {
    $('#message').hide();
  }
};

const display = () => {
  if (status === previousStatus) {
    return;
  }
  previousStatus = status;
  console.log(status);

  switch (status) {
    case -1:
      displayMessage("Sorry, but we can't scrap this offer yet :'(");
      break;

    case 0:
      displayMessage('Please log in', false, true);
      break;

    case 1:
      displayMessage('Please rate this job offer', true, false);
      break;

    case 2:
      displayMessage('Yeah! This opportunity has been added to your dashboard');
      break;

    default:
      displayMessage('Please reload');

  }
};

const login = () => {
  if (status === 0 && loggedIn) {
    status = 1;
  }
};

const popupHandlers = {
  loggedInStatus: (isLogged) => {
    loggedIn = isLogged;
    login();
  },
  isValidOpportunity: (isValid) => {
    if (isValid) {
      console.log('Offer valid');
      status = 0;
    } else {
      console.log('Offer not valid');
      status = -1;
    }
    login();
  },
  newOpportunity: () => {
    status = 2;
  }
};

const message = msg.init('popup', popupHandlers);

$(document).ready(() => {
  askToCheckContent();
  $(document).on('click', '#authenticate', askToAuthenticate);
  $(document).on('click', '.star', askToScrapContent);
  display();
  setInterval(display, 100);
});
