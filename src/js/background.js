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
  userCredentials = undefined;
  chrome.storage.sync.get('user_credentials', (value) => {
    if (value.user_credentials !== undefined) {
      userCredentials = value.user_credentials;
      sendLoginStatus();
      return;
    }

    if (chrome.runtime.lastError) {
      console.log('Failed to read credentials: ', chrome.runtime.lastError);
    }
    userCredentials = undefined;
    sendLoginStatus();
  });
};

const storeCredentials = (user) => {
  const data = {
    email: user.email,
    authentication_token: user.authentication_token
  };
  chrome.storage.sync.set({ user_credentials: data }, () => {
    if (chrome.runtime.lastError) {
      console.log('Failed to store credentials: ', chrome.runtime.lastError);
      // failed
    } else {
      console.log('Credentials stored');
      // success
    }
    readCredentials();
  });
};

const authenticate = (data) => {
  console.log(data);
  $.ajax({
    method: 'POST',
    url: authenticateUrl,
    data,
    success: (response) => {
      console.log('Fetched token');
      if (response.user !== undefined) {
        console.log(response.user);
        storeCredentials(response.user);
      } else {
        console.log('Wrong credentials');
        // failed
      }
    },
    error: () => {
      console.log('Failed to fetch token');
      // failed
    }
  });
};

const logOut = () => {
  userCredentials = undefined;
  chrome.storage.sync.clear();
  console.log('Logged out');
};

const isLogged = () => {
  return (userCredentials !== undefined &&
  userCredentials.email !== undefined &&
  userCredentials.authentication_token !== undefined);
};

const sendLoginStatus = () => {
  message.bcast(['popup', 'options'], 'isLogged', isLogged());
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
      message.bcast(['popup'], 'newOpportunity');
    },
    error: () => {
      console.log('Failed to create opportunity');
    }
  });
};

const backgroundHandlers = {
  onConnect: (context) => {
    console.log(`${context} connected`);
    if (context === 'popup') {
      message.bcast(['popup', 'options'], 'onLoad', isLogged());
      console.log(`Sent logging status (onLoad): ${isLogged()}`);
    }
  },

  onDisconnect: (context) => {
    console.log(`${context} disconnected`);
  },

  authenticate,

  logOut,

  createOpportunity
};

const message = msg.init('bg', backgroundHandlers);

$(() => {
  readCredentials();
});
