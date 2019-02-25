"use strict";

var wordsArray = [
  "England",
  "France",
  "Paris",
  "Morocco",
  "United States",
  "Germany",
  "Austria",
  "Ghana",
  "Kenya",
  "Peru"
];
var results;
var i = 0;
var country;
var resultsLimit = 10;

populateButtons();

function populateButtons() {
  $("#buttons_go_here").empty();

  // Looping on array of countries
  for (var i = 0; i < wordsArray.length; i++) {
    // Creating a button for each word
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var newButton = $("<button>");
    // Adding a class
    newButton.addClass("country");
    // Adding a data-attribute with a value of the movie at index i
    newButton.attr("data-name", wordsArray[i]);
    // Providing the button's text with a value of the movie at index i
    newButton.text(wordsArray[i]);
    // Adding the button to the HTML
    $("#buttons_go_here").append(newButton);
  }
}

$("#add-button").on("click", function(event) {
  //for safety
  event.preventDefault();

  // This line will grab the text from the input box
  var newCountry = $("#word-input")
    .val()
    .trim();

  var isDuplicate = false;

  //checking to see if a country has already been entered

  for (var c = 0; c < wordsArray.length; c++) {
    //comparing the string  in lower case to all other strings in the array

    var transformedEntry = newCountry.toLowerCase();
    var transformedArrayEntry = wordsArray[c].toLowerCase();

    if (transformedArrayEntry == transformedEntry) {
      isDuplicate = true;
      alert("You already entered that location. Try another one!");
    }
  }

  if (isDuplicate == false) {
    wordsArray.push(newCountry);

    // calling renderButtons which handles the processing of our movie array
    populateButtons();
  }

  $("#word-input").val("");

  // }
});

$("#buttons_go_here").on("click", ".country", function() {
  $("#gifs-go-here").empty();
  $("#out-of-giphs-text").text("");

  //setting the text to nothing
  $("#out-of-giphs-text").text("");

  country = $(this).attr("data-name");
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    country +
    "&api_key=dc6zaTOxFJmzC&limit=10";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    results = response.data;

    for (i = 0; i < results.length; i++) {
      var gifDiv = $("<div>");
      gifDiv.addClass("country-gif");

      var rating = results[i].rating;

      var p = $("<p>").text("RATING: " + rating);

      var newGif = $("<img>");
      newGif.attr("src", results[i].images.fixed_height_still.url);
      newGif.attr("data-arrayPlace", i);
      newGif.attr("data-isStill", true);

      gifDiv.prepend(p);
      gifDiv.prepend(newGif);

      $("#gifs-go-here").prepend(gifDiv);
      $("#see-more-button").removeClass("d-none");
    }
  });
});

$("#gifs-go-here").on("click", "img", function() {
  var a = $(this).attr("data-arrayPlace");
  var isStill = $(this).attr("data-isStill");

  if (isStill == "true") {
    $(this).attr("src", results[a].images.fixed_height.url);
    $(this).attr("data-isStill", false);
  } else {
    $(this).attr("src", results[a].images.fixed_height_still.url);
    $(this).attr("data-isStill", true);
  }
});

$("#see-more-button").on("click", function() {
  resultsLimit = resultsLimit + 10;
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    country +
    "&api_key=dc6zaTOxFJmzC&limit=" +
    resultsLimit;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    results = response.data;

    for (i; i < results.length; i++) {
      var gifDiv = $("<div>");
      gifDiv.addClass("country-gif");

      var rating = results[i].rating;

      var p = $("<p>").text("RATING: " + rating);

      var newGif = $("<img>");
      newGif.attr("src", results[i].images.fixed_height_still.url);
      newGif.attr("data-arrayPlace", i);
      newGif.attr("data-isStill", true);

      gifDiv.prepend(p);
      gifDiv.prepend(newGif);

      $("#gifs-go-here").append(gifDiv);
    }
    //in case giphy runs out of giphs on that topic
    if (results.length < resultsLimit) {
      $("#out-of-giphs-text").text(
        "We're sorry--we can't find anymore giphs about that topic"
      );
      $("#see-more-button").addClass("d-none");
    }
  });
});
