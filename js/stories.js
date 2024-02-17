"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

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
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
        ${generateStarHTML(story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** When user is logged in, generates favorite icon next to story according to user's favorites;
 * If user is logged out, no favorite icon appears next to stories
*/

function generateStarHTML(story) {
  if (currentUser) {
    const starClass = currentUser.isFavorite(story) ? "bi-star-fill" : "bi-star";
    return (
      `<span class="star">
        <i class="bi ${starClass}"></i>
      </span>`);
  } else {
    return "";
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Using data from new story submit form, retrieve story data from server
 * and add new story to the page
 */

async function submitAndShowNewStory(evt) {
  evt.preventDefault();

  // get the data from the form
  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const newStory = { author, title, url };

  const story = await storyList.addStory(currentUser, newStory);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // reference: https://stackoverflow.com/questions/16452699/how-to-reset-a-form-using-jquery-with-reset-method
  $submitStoryForm.trigger("reset");
}

$submitStoryForm.on("submit", submitAndShowNewStory);

/** when star on  allStoriesList is clicked, user.addFavorite(story) & add to $favoritedStories
 * ... if star is already selected and user un-selects it user.removeFavorite(story) & remove from $favoritedStories
*/

// TODO: look into toggle class and functionality
// resource: https://www.geeksforgeeks.org/how-to-toggle-between-two-classes-in-jquery/
// $().toggleClass("bi-star bi-star-fill")

async function selectAndUnselectFavoriteStory(evt) {
  evt.preventDefault();

  const $starIcon = $(evt.target);
  const starStoryId = $starIcon.closest("li").attr("id");
  const story = await Story.getStory(starStoryId);

  if ($starIcon.hasClass("bi-star")) {
    $starIcon.removeClass("bi-star").addClass("bi-star-fill");
    await currentUser.addFavorite(story);
  } else {
    $starIcon.removeClass("bi-star-fill").addClass("bi-star");
    await currentUser.removeFavorite(story);
  }
}

$storiesLists.on("click", ".star", selectAndUnselectFavoriteStory);

/** displays all favorited stories in the "favorites" page */

function displayFavoritedStories() {
  $favoritedStories.empty();

  currentUser.favorites.forEach(s => {
    const $story = generateStoryMarkup(s);
    $favoritedStories.append($story);
  });

  $favoritedStories.show();
}