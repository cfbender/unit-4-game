function Character(hp, attack, counterAttack) {
  this.hp = hp;
  this.attack = attack;
  this.counterAttack = counterAttack;
}

const characters = {
  adolin: new Character(24, 6, 2),
  dalinar: new Character(50, 5, 8),
  jasnah: new Character(22, 8, 4),
  kaladin: new Character(30, 5, 5),
  navani: new Character(20, 3, 5),
  shallan: new Character(18, 8, 4)
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

  if (!game.characterSelected) {
    game.playerCharacterName = charClicked;
    game.playerCharacter = characters[charClicked];
    playerContainer.append($(charCreator(charClicked)));
    game.characterSelected = true;
    $(this).fadeOut("slow");
    $.when(headerChange("CHOOSE YOUR OPPONENT")).done(opponentSwitcher);
  } else if (!game.opponentSelected) {
    game.opponentCharacterName = charClicked;
    game.opponentCharacter = characters[charClicked];
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

  game.opponentCharacter.hp -= game.playerCharacter.attack;

  opponentHP.css("color", "#E30531");
  opponentHP.text(game.opponentCharacter.hp);

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

function headerChange(newText) {
  $(".select-header").fadeOut("slow", function() {
    $(".select-header").text(newText);
    $(".select-header").fadeIn("slow");
  });
}

function opponentSwitcher() {
  gameContainer.fadeOut("slow");
  gameElements.fadeOut("slow");
  $("#character-select").fadeIn("slow");
  $(".char")
    .not("#" + game.playerCharacterName)
    .not(game.opponentsDefeated.join(","))
    .fadeIn("slow");
}

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
  });
}
function fightWon() {
  game.opponentsDefeated.push("#" + game.opponentCharacterName);
  $("#attack").fadeOut(200, function() {
    game.opponentSelected = false;
    $.when(opponentSwitcher()).done(headerChange("YOU WON THE BATTLE!"));
    $(".select-header")
      .promise()
      .done(function() {
        headerChange("CHOOSE YOUR NEXT OPPONENT");
        $('#opponentCharImg').remove();
      });
  });
}

function gameEnd() {
  //     if gameWin:
  //         pop up You Win box with new game button
  //     else
  //         pop up You Lose box with new game button
}

for (let char of Object.keys(characters)) {
  console.log(characters[char].hp);
}

$(".char").click(charHandler);

$("#attack").click(atkHandler);

$("#new-game").click(function() {
  //     characterSelected to false
  //     opponentSelected to false
  //     move all characters to select area and unhide
});
