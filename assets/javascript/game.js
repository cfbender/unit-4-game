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
  opponentCharacter: "",
  opponentRemaining: Object.keys(characters).length
};

let gameContainer = $("#game-container");
let gameElements = gameContainer.children();
let playerContainer = $("#player-character");
let opponentContainer = $("#opponent-character");

function charHandler() {
  let charClicked = this.id;

  if (!game.characterSelected) {
    game.playerCharacter = charClicked;
    game.characterSelected = true;
    $(this).fadeOut("slow");
    playerContainer.append($("#"+charClicked).clone())
    opponentSwitcher();
  } else if (!game.opponentSelected) {
    game.opponentCharacter = charClicked;
    game.opponentSelected = true;
    opponentContainer.append($("#"+charClicked).clone())
    gameEnter();
  }
}

function opponentSwitcher() {
    gameContainer.fadeOut("slow");
    gameElements.fadeOut("slow");
    $(".char")
        .not("#" + game.playerCharacter)
        .fadeIn("slow");
    $(".select-header").fadeOut("slow", function() {
    $(".select-header").text("CHOOSE YOUR OPPONENT");
    $(".select-header").fadeIn("slow");
      });
}

function gameEnter() {
    $("#character-select").fadeOut("slow", function() {
        gameContainer.fadeIn("slow");
        gameContainer.attr( "style", "display: grid;" )
        gameElements.fadeIn("slow");
        playerContainer.fadeIn("slow");
        playerContainer.attr( "style", "display: grid;" );
        opponentContainer.fadeIn("slow");
        opponentContainer.attr( "style", "display: grid;" );
    });
}

for (let char of Object.keys(characters)) {
  console.log(characters[char].hp);
}


$(".char").click(charHandler);
