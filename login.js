/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

/**
 * @return {!Object} The FirebaseUI config.
 */
 function getUiConfig() {
    return {
      'signInSuccessUrl': 'shortURL.html',
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'popup',
      'signInOptions': [
        // TODO(developer): Remove the providers you don't need for your app.
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          clientId: CLIENT_ID
        },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // Whether the display name should be displayed in Sign Up page.
          requireDisplayName: true,
          signInMethod: getEmailSignInMethod(),
          disableSignUp: {
            status: getDisableSignUpStatus()
          }
        }
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com',
      // Privacy policy url.
      'privacyPolicyUrl': 'https://www.google.com',
      'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
          firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
          firebaseui.auth.CredentialHelper.NONE
    };
  }
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // Disable auto-sign in.
  ui.disableAutoSignIn();
  
  
  /**
   * @return {string} The URL of the FirebaseUI standalone widget.
   */
  function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
        getEmailSignInMethod();
  }
  
  
  /**
   * Redirects to the FirebaseUI widget.
   */
  var signInWithRedirect = function() {
    window.location.assign(getWidgetUrl());
  };
  
  
  /**
   * Open a popup with the FirebaseUI widget.
   */
  var signInWithPopup = function() {
    window.open(getWidgetUrl(), 'Sign In', 'width=985,height=735');
  };
  
  
  /**
   * Displays the UI for a signed in user.
   * @param {!firebase.User} user
   */
  var handleSignedInUser = function(user) {
    window.location.href = "shortURL.html";
  };
  
  
  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', getUiConfig());
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });
    
  /**
   * Handles when the user changes the reCAPTCHA or email signInMethod or email disableSignUp config.
   */
  function handleConfigChange() {
    var newRecaptchaValue = document.querySelector(
        'input[name="recaptcha"]:checked').value;
    var newEmailSignInMethodValue = document.querySelector(
        'input[name="emailSignInMethod"]:checked').value;
    var currentDisableSignUpStatus = document.getElementById("email-disableSignUp-status").checked;
    location.replace(
        location.pathname + '#recaptcha=' + newRecaptchaValue +
        '&emailSignInMethod=' + newEmailSignInMethodValue +
        '&disableEmailSignUpStatus=' + currentDisableSignUpStatus);
    // Reset the inline widget so the config changes are reflected.
    ui.reset();
    ui.start('#firebaseui-container', getUiConfig());
  }

  document.getElementById('sign-out').onclick = () => firebase.auth().signOut();
 
  