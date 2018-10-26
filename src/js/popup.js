import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import handlers from './modules/handlers';
import msg from './modules/msg';
import form from './modules/form';
import runner from './modules/runner';

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


// form.init(runner.go.bind(runner, msg.init('popup', handlers.create('popup'))));

const authenticateUrl = 'http://localhost:3000/api/v1/sessions';
const createOpportunityUrl = 'http://localhost:3000/api/v1/opportunities';

const createOpportunity = (credentials) => {
  $.ajax({
    method: 'POST',
    url: createOpportunityUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': credentials.email,
      'X-User-Token': credentials.authentication_token
    },
    dataType: 'json',
    success: (data) => {
      console.log('Created new opportunity');
      console.log(data);
    }
  });
};

const isLogged = (credentials) => {
  if (chrome.runtime.lastError) {
    console.log('Failed to read credentials:', chrome.runtime.lastError);
  }

  if (credentials.user_credentials === undefined) {
    console.log('Not logged');
    $('#authenticate').show();
  } else {
    createOpportunity(credentials);
  }
};

const getCredentials = () => { chrome.storage.sync.get('user_credentials', isLogged) };

const setCredentials = (user) => {
  chrome.storage.sync.clear();
  const data = {
    email: user.email,
    authentication_token: user.authentication_token
  }
  chrome.storage.sync.set({ user_credentials: data }, () => {
    if (chrome.runtime.lastError) {
      console.log('Failed to store credentials:', chrome.runtime.lastError);
    } else {
      $('#authenticate').hide();
    }
  });
  console.log('Set credentials');
};

const authenticate = (data) => {
  $.ajax({
    method: 'POST',
    url: authenticateUrl,
    data,
    success: (response) => {
      console.log('Fetched token');
      setCredentials(response.user);
    },
    error: () => {
      console.log('Failed to fetch token');
    }
  });
};

const onClick = (e) => {
  e.preventDefault();
  console.log('click');
  const credentials = {
    email: 'test@test.com',
    password: '123456'
  };
  authenticate(credentials);
};

$(() => {
  // chrome.storage.sync.clear();
  getCredentials();
});
$(document).on('click', '#authenticate', onClick);


// chrome.browserAction.setPopup({popup: "new.html"});
