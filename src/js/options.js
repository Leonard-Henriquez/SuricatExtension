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
// `hadnlers` parameter for good when invoking msg.init()

console.log('OPTIONS SCRIPT WORKS!'); // eslint-disable-line no-console

const onClick = (e) => {
  e.preventDefault();
  console.log('Logging out');
  message.bg('logOut');
  $('#logout').prop('disabled', true);
};

const message = msg.init('options');

$(document).on('click', '#logout', onClick);
