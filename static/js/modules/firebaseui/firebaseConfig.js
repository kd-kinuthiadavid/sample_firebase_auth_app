// signInOptions on index
var createInitialSignInOptions = function(){
  signInOptions = [
        // Phone
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'normal', // 'invisible' or 'compact'
            badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: 'US', // Set default country to Kenya .(+254).
          whitelistedCountries: ['US', '+1'],
          loginHint: '+1 650-555-1234'

        }
      ];
  return signInOptions;
};

// signInOptions for account linking
var createLinkingSignInOptions = function(){
  signInOptions = [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ];
  return signInOptions;
};

// set auth configurations
var firebaseUiConfigurations = function(options, successUrl){
  var getUiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: successUrl,
    signInOptions: options,
    // Terms of service url.
    tosUrl: 'https://github.com/kd-kinuthiadavid/sample_firebase_auth_app',
    // Privacy policy url.
    privacyPolicyUrl: 'https://github.com/kd-kinuthiadavid/sample_firebase_auth_app'
  };
  return getUiConfig;
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(window.firebase.auth());

var elementOnIndex = document.getElementsByClassName('firebaseUiAuthContainer')[0];
var linkingElement = document.getElementsByClassName('firebaseUiAuthLinkingContainer')[0];

//function that fires off the widget.
var startUi = function(authContainer, uiconfigurations){
  // Is there an email link sign-in?
  if (ui.isPendingRedirect()) {
    return ui.start(authContainer, uiconfigurations);
  } else {
    return ui.start(authContainer, uiconfigurations);
  };
};



// function to display the correct ui widgets
var displayFirebaseUiWidget = function(){
return elementOnIndex ? startUi('.firebaseUiAuthContainer', firebaseUiConfigurations(createInitialSignInOptions(), '/link_accounts'))
: linkingElement ? startUi('.firebaseUiAuthLinkingContainer', 
firebaseUiConfigurations(createLinkingSignInOptions(), '/profile'))
: console.log("auth isn't being handled in this page!!!");
};

var handleSignedInUser = function(user){
  // User is signed in.
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var uid = user.uid;
  var phoneNumber = user.phoneNumber;
  var providerData = user.providerData;
  user.getIdToken().then(function(accessToken) {
    document.getElementById('phone_number').textContent = phoneNumber;
    document.getElementById('email').textContent = email;
    document.getElementById('display_name').textContent = displayName;
    document.getElementById('profile_pic_url').src = photoURL;
    document.getElementById('sign_out').addEventListener('click', function(){
      firebase.auth().signOut().then(alert('succesfully signed out!!!')).then(function(){
        window.location.assign("/");
      });
    });
    document.getElementById('go_home').addEventListener('click', function(){
      window.location.assign('/');
    });
  });
  console.log("user is signed in, here's their data", user.providerData);
  if (linkingElement){
    // linkAccount();
  };
};

var handleSignedOutUser = function (){
  // User is signed out.
  console.log('user is signed out!!!')
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

window.addEventListener('load', function() {
  displayFirebaseUiWidget();
});


var getProviderToLinkWith = function(id){
  if (id =='facebook.com') {
    console.log("facebook!!!!!", id);
    var ProviderToLinkWith = new firebase.auth.FacebookAuthProvider();
    return ProviderToLinkWith;
  } else if (id == 'twitter') {
    console.log('twitter!!!!!', id);
    var ProviderToLinkWith = new firebase.auth.TwitterAuthProvider();
    return ProviderToLinkWith;
  } else if (id == 'google.com'){
    console.log('google!!!!!!', id);
    var ProviderToLinkWith = new firebase.auth.GoogleAuthProvider();
    return ProviderToLinkWith;
  } else {
    console.log("must be a phone then!!!!!!")
  };
};

var linkAccount = function(){
  user = firebase.auth().currentUser;
  phone = user.phoneNumber;
  if (phone == null ) {
    console.log("user email is null", phone);
    provider = 
    // Do the linking
    firebase.auth().currentUser.linkWithRedirect(provider).then(function(result) {
      // Accounts successfully linked.
      console.log('Accounts Succesfully linked!!!')
      var credential = result.credential;
      var user = result.user; // you can print for debugging
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      console.log('An ERROR occurred during account linking: ', error)
      // ...
    });
  };
};