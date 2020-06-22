// replace this values with the one generated in your TokBox Account
const apiKey = 'API_KEY';
const appServerUrl = 'http://localhost:3000/tkbx';

let sessionId;
let token;

// 1. Create session
createSession();

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

// 1.1 After create session, call getToken(sessionId)
function createSession() {
	$.post(appServerUrl + "/session", null, (data, status) => {
    console.log("the response of /session", data, status);
    sessionId = data.sessionId;
    getToken()
  });
}

// 2. After getToken, call initializeSession() and continue according to the tutorial
function getToken(sessionId) {
	$.post(appServerUrl + "/user", null, (data, status) => {
    console.log("the response of /user", data, status);
    token = data.token;
    initializeSession();
  });
}

// 3. Complete according to the tutorial
function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });

  // Create a publisher
  var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}
