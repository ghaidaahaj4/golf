document.addEventListener('DOMContentLoaded', () => {
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const valueScores = { Ace: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 0, '8': 8, '9': 9, '10': 10, Jack: -1, Queen: 12, King: 13 };
    let deck = [];
    let discardPile = [];
    let players = [{ name: 'Player 1', hand: [], score: 0 }, { name: 'Player 2', hand: [], score: 0 }];
    let currentPlayerIndex = 0;
    let gameOver = false;
  
    const player1HandDiv = document.getElementById('player-1-hand');
    const player2HandDiv = document.getElementById('player-2-hand');
    const discardCardDiv = document.getElementById('discard-card');
    const drawButton = document.getElementById('draw-button');
    const statusDiv = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');
  
    function createDeck() {
      deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ value, suit, score: valueScores[value] });
        }
      }
      deck = deck.sort(() => Math.random() - 0.5);
    }
  
    function drawCard() {
      return deck.pop();
    }
  
    function setupGame() {
      createDeck();
      gameOver = false;
      players.forEach(player => {
        player.hand = [];
        player.score = 0;
      });
  
      for (let player of players) {
        for (let i = 0; i < 4; i++) {
          player.hand.push({ ...drawCard(), faceUp: false });
        }
      }
  
      discardPile = [drawCard()];
      currentPlayerIndex = 0;
      updateBoard();
    }
  
    function updateBoard() {
      player1HandDiv.innerHTML = renderHand(players[0].hand, 0);
      player2HandDiv.innerHTML = renderHand(players[1].hand, 1);
      discardCardDiv.innerHTML = renderCard(discardPile[discardPile.length - 1]);
      statusDiv.textContent = `${players[currentPlayerIndex].name}'s Turn`;
  
      if (gameOver) {
        statusDiv.textContent = 'Game Over! ' + determineWinner();
        drawButton.disabled = true;
        restartButton.style.display = 'block';
      }
    }
  
    function renderHand(hand, playerIndex) {
      return hand
        .map((card, index) => {
          return `<div class="card ${card.faceUp ? 'face-up' : 'face-down'}" 
                    onclick="flipCard(${playerIndex}, ${index})">
                  ${card.faceUp ? `${card.value} of ${card.suit}` : 'X'}
                </div>`;
        })
        .join('');
    }
  
    function renderCard(card) {
      return `<div class="card face-up">${card.value} of ${card.suit}</div>`;
    }
  
    window.flipCard = (playerIndex, cardIndex) => {
      if (currentPlayerIndex === playerIndex && !gameOver) {
        let card = players[playerIndex].hand[cardIndex];
        if (!card.faceUp) {
          card.faceUp = true;
          updateBoard();
          if (checkGameOver()) {
            gameOver = true;
            updateBoard();
          } else {
            endTurn();
          }
        }
      }
    };
  
    function checkGameOver() {
      return players.every(player => player.hand.every(card => card.faceUp));
    }
  
    function endTurn() {
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
      updateBoard();
    }
  
    drawButton.addEventListener('click', () => {
      if (deck.length === 0) return;
      const drawnCard = drawCard();
      discardPile.push(drawnCard);
      updateBoard();
      endTurn();
    });
  
    restartButton.addEventListener('click', () => {
      restartButton.style.display = 'none';
      drawButton.disabled = false;
      setupGame();
    });
  
    function determineWinner() {
      calculateScores();
      if (players[0].score < players[1].score) return `${players[0].name} Wins!`;
      if (players[0].score > players[1].score) return `${players[1].name} Wins!`;
      return "It's a Draw!";
    }
  
    function calculateScores() {
      players.forEach(player => {
        player.score = player.hand.reduce((total, card) => total + card.score, 0);
      });
    }
  
    setupGame();
  });
  