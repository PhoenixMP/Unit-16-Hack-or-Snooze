"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();

  $navLogOut.show();
  $navAddStory.show();
  $navFavorites.show();
  $navUserStories.show();
  $navAllStories.hide();
  $addStoryForm.hide();

}

$body.on("click", "#nav-all-stories", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
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
  $navAddStory.show();
  $navFavorites.show();
  $navUserStories.show();
  $navAllStories.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show Add Story form on click on "Submit" */

function navAddStory(evt) {
  console.debug("navAddStory", evt);
  hidePageComponents();
  $navFavorites.show();
  $navAllStories.show();
  $addStoryForm.show();
  $navAddStory.hide();
  $navUserStories.show();
}

$navAddStory.on("click", navAddStory);


/** Show list of favorited stories */
//%%%%%%%%%%%%%%%%%%%%
function navFavorites(evt) {
  console.debug("navFavorites", evt);
  generateFavoriteStories();
 
  $navFavorites.hide();
  $navAllStories.show();
  $navUserStories.show();
  $navAddStory.show();

  $allStoriesList.hide();
  $userStoriesList.hide();
  $addStoryForm.hide();
  $favoriteStoriesList.show();
}

$navFavorites.on("click", navFavorites);






/** Show list of user stories */
//%%%%%%%%%%%%%%%%%%%%
function navUserStories(evt) {
  console.debug("navUserStories", evt);
  generateUserStories();
  $navUserStories.hide();
  $navFavorites.show();
  $navAllStories.show();
  $navAddStory.show();

  $allStoriesList.hide();
  $favoriteStoriesList.hide();
  $addStoryForm.hide();
  $userStoriesList.show();
}

$navUserStories.on("click", navUserStories);


