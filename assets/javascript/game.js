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

function charHandler() {
  let charClicked = this.id;

  if (!game.characterSelected) {
    game.playerCharacter = charClicked;
    game.characterSelected = true;
    $(this).fadeOut("slow");
    opponentSwitcher();
  } else if (!game.opponentSelected) {
    game.opponentCharacter = charClicked;
    game.opponentSelected = true;
    gameEnter();
  }
}

function opponentSwitcher() {
  $(".char")
    .not("#" + game.playerCharacter)
    .show();
  $(".select-header").fadeOut("slow", function() {
    $(".select-header").text("CHOOSE YOUR OPPONENT");
    $(".select-header").fadeIn("slow");
  });
}

function gameEnter() {
    $("#character-select").fadeOut("slow", function() {
        $("game-container").fadeIn("slow");
    });
}

for (let char of Object.keys(characters)) {
  console.log(characters[char].hp);
}


$(".char").click(charHandler);
