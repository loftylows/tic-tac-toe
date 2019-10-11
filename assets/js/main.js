                            //Gobal Variables//

let alert_button = $("button[name=alert]")

let init_alert_settings = {height: 200,
                           holderClass: 'custom',
                           showClose: true,
                           showCloseText: 'Close',
                           enableStackAnimation: true,
                           onBlurContainer: '#container',
                           template: "<p>Your game has been reset.</p>"
                         }

                            //Objects//

const game = {
  current_turn: "x",

  board: [1,2,3,
          4,5,6,
          7,8,9],

  //This property determines whether the reset button will or won't restart the game//
  will_reset: true,

  //Game will end in a tie once 9 turns have been taken//
  game_turns_taken: 0,

  //Adds a player marker to the array representing the internal game board//
  add_turn(index) {
    this.board[index] = this.current_turn
  },

  reset_game() {
    $("#game_board li").html("")
    this.board = [1,2,3,
                  4,5,6,
                  7,8,9]
    this.game_turns_taken = 0
    this.current_turn = "x"
    $("#player_turn").html(`Now Player: ${this.current_turn.toUpperCase()}`)
  },

  setup(init_alert_settings) {
    $("#player_turn").html(`Now Player: ${this.current_turn.toUpperCase()}`)
    alert_button.avgrund(init_alert_settings)
  },

  trigger_game_event(game_state, win_index) {
    if (game_state == "won") {
      init_alert_settings.template = `<p>Player ${this.board[win_index].toUpperCase()} has won. Thank you for playing.</p>`
    } else if (game_state == "tie") {
      init_alert_settings.template = "<p>The game ended in a tie. Thank you for playing.</p>"
    } else if (game_state = "invalid_move") {
      this.will_reset = false
      init_alert_settings.template = "<p>This space is already occupied. Please choose a different one.</p>"
    }
    alert_button.avgrund(init_alert_settings)
    alert_button.trigger("click")
    this.will_reset = true
    init_alert_settings.template = `<p>Your game has been reset.</p>`
    alert_button.avgrund(init_alert_settings)
  },

  game_over() {
		if (this.board[0] == this.board[1] && this.board[1] == this.board[2]) {
      this.trigger_game_event("won", 0)
		} else if (this.board[3] == this.board[4] && this.board[4] == this.board[5]) {
      this.trigger_game_event("won", 3)
    } else if (this.board[6] == this.board[7] && this.board[7] == this.board[8]) {
      this.trigger_game_event("won", 6)
		} else if (this.board[0] == this.board[3] && this.board[3] == this.board[6]) {
      this.trigger_game_event("won", 0)
		} else if (this.board[1] == this.board[4] && this.board[4] == this.board[7]) {
      this.trigger_game_event("won", 1)
		} else if (this.board[2] == this.board[5] && this.board[5] == this.board[8]) {
      this.trigger_game_event("won", 2)
    } else if (this.board[0] == this.board[4] && this.board[4] == this.board[8]) {
      this.trigger_game_event("won", 0)
    } else if (this.board[2] == this.board[4] && this.board[4] == this.board[6]) {
      this.trigger_game_event("won", 2)
    } else if (this.game_turns_taken >= 9) {
      this.trigger_game_event("tie")
    }
  },

  take_turn(box) {
    box = $(box)
    let box_index = box.index()
    let player_turn = game.current_turn

    if (box.html()) {
      game.trigger_game_event("invalid_move")
    } else if (player_turn == "x") {
      box.html(player_turn)
      game.add_turn(box_index)
      game.current_turn = "o"
      game.game_turns_taken ++;
      game.game_over()
      $("#player_turn").html(`Now Player: ${game.current_turn.toUpperCase()}`)
    } else {
      box.html(player_turn)
      game.add_turn(box_index)
      game.current_turn = "x"
      game.game_turns_taken ++;
      game.game_over()
      $("#player_turn").html(`Now Player: ${game.current_turn.toUpperCase()}`)
    }
  }
}


                            //Setup//

game.setup(init_alert_settings)

                            //Events//

//This is used to trigger alerts but may also reset the game if game.will_reset is set to true.//
alert_button.on("click", function (event) {
  if (game.will_reset) {
    game.reset_game()
  }
})

$("#game_board li").on("click", function (event) {
  game.take_turn(this)
})
