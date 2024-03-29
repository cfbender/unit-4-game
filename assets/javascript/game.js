function Character(hp, attack, counterAttack) {
  this.hp = hp;
  this.attack = attack;
  this.counterAttack = counterAttack;
}

//defining character stats
const characters = {
  adolin: new Character(60, 6, 6),
  dalinar: new Character(100, 2, 2),
  jasnah: new Character(65, 8, 4),
  kaladin: new Character(60, 5, 15),
  navani: new Character(60, 3, 8),
  shallan: new Character(55, 8, 10)
};

let game = {
  characterSelected: false,
  opponentSelected: false,
  gameWin: false,
  playerCharacter: "",
  playerCharacterName: "",
  opponentCharacter: "",
  opponentCharacterName: "",
  opponentsDefeated: [],
  opponentRemaining: Object.keys(characters).length - 1
};

let gameContainer = $("#game-container");
let gameElements = gameContainer.children();
let playerContainer = $("#player-character");
let opponentContainer = $("#opponent-character");

function charHandler() {
  let charClicked = this.id;

  //if you havent selected a player character, set the character to a clone of the object of that character
  if (!game.characterSelected) {
    game.playerCharacterName = charClicked;
    game.playerCharacter = { ...characters[charClicked] };
    playerContainer.append($(charCreator(charClicked)));
    game.characterSelected = true;
    //fades out the character and changes the header
    $(this).fadeOut("slow");
    $.when(headerChange("CHOOSE YOUR OPPONENT")).done(opponentSwitcher);
  } else if (!game.opponentSelected) {
    //same as for a player character then enters the game
    game.opponentCharacterName = charClicked;
    game.opponentCharacter = { ...characters[charClicked] };
    game.opponentSelected = true;
    opponentContainer.append($(charCreator(charClicked)));
    $(this).fadeOut("slow");
    gameEnter();
  }
}

function atkHandler() {
  let playerHP = $("#player-hp");
  let opponentHP = $("#opponent-hp");
  let playerAtk = $("#player-atk");

  opponentHP.text(game.opponentCharacter.hp);
  playerHP.text(game.playerCharacter.hp);
  playerAtk.text(game.playerCharacter.attack);
  //when attacking, lower the opponents hp by your attack
  game.opponentCharacter.hp -= game.playerCharacter.attack;
  //update color to show health lost
  opponentHP.css("color", "#E30531");
  opponentHP.text(game.opponentCharacter.hp);
  //check if you defeated the opponent
  if (game.opponentCharacter.hp <= 0) {
    game.opponentRemaining--;
    if (game.opponentRemaining === 0) {
      //VICTORY
      game.gameWin = true;
      gameEnd();
    } else {
      fightWon();
    }
  } else {
    game.playerCharacter.hp -= game.opponentCharacter.counterAttack;
    playerHP.css("color", "#E30531");
    playerHP.text(game.playerCharacter.hp);

    if (game.playerCharacter.hp <= 0) {
      //DEFEAT
      gameEnd();
    } else {
      game.playerCharacter.attack +=
        characters[game.playerCharacterName].attack;
      playerAtk.css("color", "#6AE6BC");
      playerAtk.text(game.playerCharacter.attack);
    }
  }
}
//handles the changing of the text of the header
function headerChange(newText) {
  $(".select-header").fadeOut("slow", function() {
    $(".select-header").text(newText);
    $(".select-header").fadeIn("slow");
  });
}

//handles switching to opponent selection screen
function opponentSwitcher() {
  gameContainer.fadeOut("slow");
  gameElements.fadeOut("slow");
  $("#character-select").fadeIn("slow");
  $(".char")
    .not("#" + game.playerCharacterName)
    .not(game.opponentsDefeated.join(","))
    .fadeIn("slow");
}
//creates the div that holds the characters on the battle screen
function charCreator(charName) {
  let charImage = $(
    '<img src="./assets/images/' +
      charName +
      '.png" class="char-image" charName="' +
      charName +
      '" />'
  );
  let charInfoBox = $('<div class="char-stats"></div>');
  let charInfoText = $('<div class="char-text"></div>');

  //generating player character
  if (!game.characterSelected) {
    var charDiv = $('<div id = "playerCharImg" class = "char"></div>');
    var charStats =
      '<span class = "stats-id">' +
      "HP: </span>" +
      '<span class = "stats" id ="player-hp">' +
      game.playerCharacter.hp +
      "</span>" +
      '<span class = "stats-id">' +
      "  Attack: </span>" +
      '<span class = "stats" id ="player-atk">' +
      game.playerCharacter.attack +
      "</span>";
  } else {
    var charDiv = $('<div id = "opponentCharImg" class = "char"></div>');
    var charStats =
      '<span class = "stats-id">' +
      "HP: </span>" +
      '<span class = "stats" id ="opponent-hp">' +
      game.opponentCharacter.hp +
      "</span>" +
      '<span class = "stats-id">' +
      "  Counter-Atk: </span>" +
      '<span class = "stats">' +
      game.opponentCharacter.counterAttack +
      "</span>";
  }

  charInfoText.append(charStats);
  charInfoBox.append(charInfoText);
  charDiv.append(charImage, charInfoBox);

  return charDiv;
}
//handles animations for entering the game from the character select screen
function gameEnter() {
  $("#character-select").fadeOut("slow", function() {
    gameContainer.fadeIn("slow");
    gameContainer.attr("style", "display: grid;");
    gameElements.fadeIn("slow");
    playerContainer.fadeIn("slow");
    playerContainer.attr("style", "display: grid;");
    opponentContainer.fadeIn("slow");
    opponentContainer.attr("style", "display: grid;");
    $("#attack").fadeIn("slow");
    $("#attack").attr("style", "display: grid;");
    $(".select-header").fadeOut();
  });
}
//handles the animations from winning a single fight
function fightWon() {
  game.opponentsDefeated.push("#" + game.opponentCharacterName);
  $("#attack").fadeOut(200, function() {
    game.opponentSelected = false;
    $.when(opponentSwitcher()).done(headerChange("YOU WON THE BATTLE!"));
    $(".select-header")
      .promise()
      .done(function() {
        headerChange("CHOOSE YOUR NEXT OPPONENT");
        $("#opponentCharImg").remove();
      });
  });
}

//handles win and loss and displays the option to start a new game
function gameEnd() {
  game.opponentsDefeated.push("#" + game.opponentCharacterName);
  if (game.gameWin) {
    $("#character-select").fadeOut();
    opponentSwitcher();
    $("#character-select").fadeOut();
    $(".select-header").fadeOut();
    $("#win-loss-text").text("YOU WIN!");
    $(".new-game-screen").fadeIn("slow");
  } else {
    $("#character-select").fadeOut();
    opponentSwitcher();
    $("#character-select").fadeOut();
    $("#win-loss-text").text("YOU LOSE!");
    $(".new-game-screen").fadeIn("slow");
  }
}

$(".char").click(charHandler);

$("#attack").click(atkHandler);

//re-initializes the game
$("#new-game").click(function() {
  $(".new-game-screen").fadeOut("slow");
  game.characterSelected = false;
  game.opponentSelected = false;
  game.gameWin = false;
  game.playerCharacter = {};
  game.playerCharacterName = "";
  game.opponentCharacter = {};
  game.opponentCharacterName = "";
  game.opponentsDefeated = [];
  game.opponentRemaining = Object.keys(characters).length - 1;

  gameContainer.fadeOut("slow");
  gameElements.fadeOut("slow");
  $("#playerCharImg").remove();
  $("#opponentCharImg").remove();
  headerChange("CHOOSE YOUR CHARACTER");
  $("#character-select").fadeIn("slow");
  $(".select-header").fadeIn("slow");
  $(".char").fadeIn("slow");
});
