"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit story form on click on navbar "submit" */

function navSubmitClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  $submitStoryForm.show();
  putStoriesOnPage();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorites stories list on click on navbar "favorites" */

function navFavoritesClick(evt) {
  evt.preventDefault();
  hidePageComponents();
  displayFavoritedStories();
}

$navFavorites.on("click", navFavoritesClick);