$(document).ready(function() {
  const users = [
    "P4wnyhof",
    "SmkGaming05",
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
  ];

  // respond to button select All/Online/Offine
  $(".btn-group button").click(function() {
    update($(this).text());
  });

  // Clear the channels previously listed and list the channels now selected
  function update(channels) {
    // clear the previously listed channels
    $(".twitchList").html("");

    // url to get twitch stream info per freecodecamp advice
    // https://forum.freecodecamp.org/t/freecodecamp-challenge-guide-how-to-use-the-twitchtv-api/19541
    const url = "https://wind-bow.gomix.me/twitch-api/streams/";

    // for each of the channels we are watching
    for (i = 0; i < users.length; i++) {
      console.log(users[i]);
      var jqxhr = $.getJSON(url + users[i] + "?callback=?", function() {}).done(
        function(data) {
          // display channel if it is streaming and user requested all or online,
          // or if the channel is not streaming and the user requested offline only
          if (
            data.stream !== null &&
            (channels === "Online" || channels === "All")
          )
            getOnlineChannel(data);
          // data.stream === null if not streaming, so only display if all or offline channels requested
          else if (
            data.stream === null &&
            (channels === "Offline" || channels === "All")
          )
            getOfflineChannel(data);
        }
      );
    }
  }

  // initially display all channels
  update("All");
});

function displaylogo(logo, style) {
  return (
    '<div class="col-md-3 hidden-xs"></div><div class="col-md-1 col-sm-1 logo ' +
    style +
    '"><img src=' +
    logo +
    ' class=" img-fluid "> </div>'
  );
}

function displayname(name, link, style) {
  // '<div class="col-md-1 col-sm-1 name ' +

  return (
    '<div class="col-md-1 col-sm-1 name ' +
    style +
    ' ">  <a  href="' +
    link +
    '" target="_blank">' +
    name +
    "</a>  </div>"
  );
}

function displaygame(game, status, style) {
  var div =
    '<div class="col-md-4 streaming name ' +
    style +
    '">' +
    game +
    ' <span class="hidden-xs"> - ';

  var gameAndStatus = game + status;

  if (gameAndStatus.length > 60)
    div += status.substr(0, 60 - game.length) + "...";
  else div += status;

  div += "</span></div>";

  return div;
}

function displayNoGame() {
  return '<div class="col-md-4 col-xs-1 col-sm-2 offline name"> Offline  ';
}

function displayChannel(online, link, logo, name, game, status) {
  // create div to add to list of channels
  var displayDiv;
  var style;
  if (online) style = "online";
  else style = "offline";

  // construct div based on passed variables
  displayDiv = "<div class='row '>";

  displayDiv += displaylogo(logo, style) + displayname(name, link, style);

  if (online) displayDiv += displaygame(game, status, style) + "</div>";
  else displayDiv += displayNoGame();

  displayDiv += "</div>";

  // Append it to the channels list displayed
  $(".twitchList").append(displayDiv);
}
function getOnlineChannel(data) {
  var link = "https://www.twitch.tv/" + data.stream.channel.display_name;
  var logo = data.stream.channel.logo;
  var name = data.stream.channel.display_name;
  var game = data.stream.channel.game;
  var status = data.stream.channel.status;

  displayChannel(true, link, logo, name, game, status);
}

function getOfflineChannel(data) {
  var url =
    "https://wind-bow.gomix.me/twitch-api/channels/" +
    data._links.channel.substr(38);

  var jqxhr = $.getJSON(url + "?callback=?", function() {
    console.log("success for offline getJSON");
  }).done(function(data) {
    var link = data.url;
    var logo = data.logo;
    var name = data.name;
    var game = data.game;
    var status = data.status;

    displayChannel(false, link, logo, name, game, status);
  });
}
