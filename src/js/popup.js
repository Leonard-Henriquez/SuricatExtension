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

let status = 0;

const onClick = (e) => {
  e.preventDefault();
  console.log('click');
  const credentials = {
    email: $('#email').val(),
    password: $('#password').val()
  };
  message.bg('authenticate', credentials);
};

const onRate = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    message.bcast(tabs[0].id, ['ct'], 'getContent', tabs[0].url);
  });
};


const checkLoginStatus = (isLogged) => {
  console.log(isLogged);
  if (isLogged) {
    console.log('Logged');
    $('#authentication-form').hide();
    $('#rating').hide();
    if ($('#message-content').text() === 'Not logged') {
      $('#message-content').text('Logged in');
    }
    $('#message').show();
  } else {
    console.log('Not logged');
    $('#authentication-form').show();
    $('#message').show();
    $('#message-content').text('Not logged');
    $('#rating').hide();
  }
};

const popupHandlers = {
  isLogged: (isLogged) => {
    checkLoginStatus(isLogged);
  },
  onLoad: (isLogged) => {
    checkLoginStatus(isLogged);
    if (isLogged) {
      $('#rating').show();
    }
  },
  notOpportunity: () => {
    checkLoginStatus(true);
    $('#rating').hide();
    $('#message-content').text("Sorry, but we can't scrap this offer yet :'(");
  },
  newOpportunity: () => {
    checkLoginStatus(true);
    $('#message-content').text('Yeah!! This offer has been added to your dashboard');
  }
};

const message = msg.init('popup', popupHandlers);

$(document).on('click', '#authenticate', onClick);
$(document).on('click', '.star', onRate);
