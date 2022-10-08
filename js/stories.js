"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favoriteStoriesList;
let userStoriesList;


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();

  $storiesLoadingMsg.remove();

  putStoriesOnPage();

  
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let $temp = document.createElement('a');
  let $url = story.url;
   $temp.href = $url;
  
  const hostName = $temp.hostname;
  
  return $(`
      <li id="${story.storyId}">
      <small class="favorite-symbol"> &hearts;</small>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button type="submit" class=hidden>Remove Story</button>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. If one of the stories has a storyId that matches one of the storyId's in the user favorites array, 
 * mark the heart on the story as red. 
 */

function putStoriesOnPage() {

  $allStoriesList.empty();
  $userStoriesList.empty();
  $favoriteStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    userStoriesList = currentUser.ownStories;
    favoriteStoriesList = currentUser.favorites;
    // change the heart to red if the story is a favorite
    if (favoriteStoriesList.some(val => val.storyId === story.storyId)) {
      $(`#${story.storyId}`).children().first().addClass('favorited');
    }
    // add button for deleting story if the story is yours
    if (userStoriesList.some(val => val.storyId === story.storyId)) {
      $($story).append('<button>Delete Story</button>');
    }
    
  }
  $allStoriesList.prepend('<div>All Stories</div>');
  $allStoriesList.show();
}



/** Gets list of favorited stories from server, generates their HTML, and puts on page. All stories get a red heart. 
 */
//%%%%%%%%%%%%%%%%%%%%
function generateFavoriteStories() {
   
  $allStoriesList.empty();
  $userStoriesList.empty();
  $favoriteStoriesList.empty();

  favoriteStoriesList = currentUser.favorites;


  // loop through all of our stories and generate HTML for them
  for (let story of favoriteStoriesList) {
    const $story = generateStoryMarkup(story);
    $($story).children().first().addClass('favorited');
    $favoriteStoriesList.append($story);

        // add button for deleting story if the story is yours
        if (userStoriesList.some(val => val.storyId === story.storyId)) {
          $($story).append('<button>Delete Story</button>');
        }
   
     
  }
   $favoriteStoriesList.prepend('<div>Favorites</div>');

 }

/** Gets list of user stories from server, generates their HTML, and puts on page. If one of the stories has a storyId that matches one of the storyId's in the user favorites array, 
 * mark the heart on the story as red. 
 */
//%%%%%%%%%%%%%%%%%%%%
function generateUserStories() {
  $allStoriesList.empty();
  $userStoriesList.empty();
  $favoriteStoriesList.empty();
  userStoriesList = currentUser.ownStories;
  favoriteStoriesList = currentUser.favorites;
  // loop through all of our stories and generate HTML for them
  for (let story of userStoriesList) {
    const $story = generateStoryMarkup(story);
    $($story).append('<button>Delete Story</button>');

     // change the heart to red if the story is a favorite
     if (favoriteStoriesList.some(val => val.storyId === story.storyId)) {
       $($story).children().first().addClass('favorited');
       
       
    }
    $userStoriesList.append($story);
  }
  $userStoriesList.prepend('<div>Your Stories</div>');

}





/** adds a new story to the API, generates a new list of stories from server, generates their HTML, and puts on page.
 * currentUser is updated so that the "ownStories" array in the user object is updated
 */
async function postNewStory(evt) {
  console.debug("postNewStory", evt);
  evt.preventDefault();

  const title = $("#story-title").val();
  const author= $("#story-author").val();
  const url = $("#story-url").val();

  const newStory = { title, author, url };
  await StoryList.addStory(currentUser, newStory)
 
  currentUser = await User.loginViaStoredCredentials(currentUser.loginToken, currentUser.username);

  getAndShowStoriesOnStart();
  $addStoryForm.trigger("reset");
  $addStoryForm.hide();
  $navAddStory.show();
  $navAllStories.hide();

}

$addStoryForm.on("submit", postNewStory);


/** when "delete story" button is clicked, removes story from the API, generates a new list of stories from server, generates their HTML, and puts on page.
 * Whatever page you were on when the story was deleted, that same page will still show

 */
//%%%%%%%%%%%%%%%%%%%%
$(".stories-list").on("click", "button", async function removeStory(evt) {
  console.debug("removeStory", evt);
  evt.preventDefault();
  const $removedStory = $(evt.target);
  const $storyId = $removedStory.parent().attr('id')
  
  await StoryList.removeStory(currentUser.loginToken, $storyId);
  currentUser = await User.loginViaStoredCredentials(currentUser.loginToken, currentUser.username)

  console.log($removedStory.parent().parent().attr('id'));
  if ($removedStory.parent().parent().attr('id') === "favorite-stories-list") {
   
    navFavorites();
  
  } if ($removedStory.parent().parent().attr('id') === "user-stories-list") {
    navUserStories();
   
  } if ($removedStory.parent().parent().attr('id') === "all-stories-list") {
    getAndShowStoriesOnStart();
    
  }

});




/** When one of the hearts are clicked on a story, it will toggle on and off with red fill. 
 * If the red-fill is turned on, "addFavorite" is called and the user API is updated with the new favorite. 
 * if the red-fill is removed, "removeFavorite" is called and the user API is updated to not have that favorite anymore.
 * If you are on the favorites page, the favorites page will be refreshed.
 * .
  */

$(".stories-list").on("click", ".favorite-symbol", async function changeFavorites(evt) {
  console.debug("changeFavorites", evt);
  evt.preventDefault();
  const $favoriteStory = $(evt.target);
  const $storyId = $favoriteStory.parent().attr('id');

  if ($favoriteStory.hasClass('favorited')) {
   
    $favoriteStory.removeClass('favorited');
    await User.removeFavorite(currentUser.loginToken, currentUser.username, $storyId);
    currentUser = await User.loginViaStoredCredentials(currentUser.loginToken, currentUser.username);
  
    if ($favoriteStory.parent().parent().attr('id') === "favorite-stories-list") {
      navFavorites();
    }

  } else {
    
    $favoriteStory.addClass('favorited');
    await User.addFavorite(currentUser.loginToken, currentUser.username, $storyId);
    currentUser = await User.loginViaStoredCredentials(currentUser.loginToken, currentUser.username);
  
  }
 

});

