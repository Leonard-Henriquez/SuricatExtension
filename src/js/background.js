import $ from 'jquery';
import msg from './modules/msg';

// here we use SHARED message handlers, so all the contexts support the same
// commands. in background, we extend the handlers with two special
// notification hooks. but this is NOT typical messaging system usage, since
// you usually want each context to handle different commands. for this you
// don't need handlers factory as used below. simply create individual
// `handlers` object for each context and pass it to msg.init() call. in case
// you don't need the context to support any commands, but want the context to
// cooperate with the rest of the extension via messaging system (you want to
// know when new instance of given context is created / destroyed, or you want
// to be able to issue command requests from this context), you may simply
// omit the `hadnlers` parameter for good when invoking msg.init()

console.log('BACKGROUND SCRIPT WORKS!');

const authenticateUrl = 'http://localhost:3000/api/v1/sessions';
const createOpportunityUrl = 'http://localhost:3000/api/v1/opportunities';

let userCredentials;

const readCredentials = () => {
  chrome.storage.sync.get('user_credentials', (value) => {
    if (value.user_credentials !== undefined) {
      userCredentials = value.user_credentials;
      return;
    }

    if (chrome.runtime.lastError) {
      console.log('Failed to read credentials: ', chrome.runtime.lastError);
    }
    userCredentials = undefined;
  });
};

const storeCredentials = (user) => {
  chrome.storage.sync.clear();
  const data = {
    email: user.email,
    authentication_token: user.authentication_token
  };
  chrome.storage.sync.set({ user_credentials: data }, () => {
    if (chrome.runtime.lastError) {
      console.log('Failed to store credentials: ', chrome.runtime.lastError);
    } else {
      $('#authenticate').hide();
    }
  });
  console.log('Set credentials');
};

const isLogged = () => userCredentials !== undefined &&
  userCredentials.email !== undefined &&
  userCredentials.authentication_token !== undefined;

const sendLoginStatus = () => {
  message.bcast(['popup'], 'isLogged', isLogged());
  console.log(`Sent logging status: ${isLogged()}`);
};

const createOpportunity = (data) => {
  console.log(data);
  $.ajax({
    method: 'POST',
    url: createOpportunityUrl,
    dataType: 'json',
    data: JSON.stringify({ opportunity: data }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userCredentials.email,
      'X-User-Token': userCredentials.authentication_token
    },
    success: (response) => {
      console.log('Created new opportunity');
      console.log(response);
    },
    error: () => {
      console.log('Failed to create opportunity');
    }
  });
};

const authenticate = (data) => {
  $.ajax({
    method: 'POST',
    url: authenticateUrl,
    data,
    success: (response) => {
      console.log('Fetched token');
      console.log(response.user);
      message.bcast(['popup'], 'storeCredentials', response.user);
    },
    error: () => {
      console.log('Failed to fetch token');
    }
  });
};

const backgroundHandlers = {
  onConnect: (context) => {
    console.log(`${context} connected`);
    if (context === 'popup') {
      sendLoginStatus();
    }
  },

  onDisconnect: (context) => {
    console.log(`${context} disconnected`);
  },

  storeCredentials,

  authenticate,

  createOpportunity
};

const message = msg.init('bg', backgroundHandlers);

$(() => {
  // chrome.storage.sync.clear();
  readCredentials();
});
