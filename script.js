document.addEventListener('DOMContentLoaded', () => {
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
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
  

    function createDeck() {
      deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ value, suit });
        }
      }
      deck = deck.sort(() => Math.random() - 0.5);
    }
  

    function drawCard() {
      return deck.pop();
    }
  
 
    function setupGame() {
      createDeck();
  
      //  4 cards to each player
      for (let player of players) {
        player.hand = [];
        for (let i = 0; i < 4; i++) {
          player.hand.push({ ...drawCard(), faceUp: false });
        }
      }
  
      discardPile.push(drawCard());
      updateBoard();
    }
  
    // Update game board 
    function updateBoard() {
      player1HandDiv.innerHTML = renderHand(players[0].hand, 0);
      player2HandDiv.innerHTML = renderHand(players[1].hand, 1);
      discardCardDiv.innerHTML = renderCard(discardPile[discardPile.length - 1]);
      statusDiv.textContent = `${players[currentPlayerIndex].name}'s Turn`;
    }
  
    // single hand
    function renderHand(hand, playerIndex) {
      return hand.map((card, index) => {
        return `<div class="card ${card.faceUp ? 'face-up' : 'face-down'}" 
                    onclick="flipCard(${playerIndex}, ${index})">
                  ${card.faceUp ? `${card.value} of ${card.suit}` : 'X'}
                </div>`;
      }).join('');
    }
  
    // single card
    function renderCard(card) {
      return `<div class="card face-up">${card.value} of ${card.suit}</div>`;
    }
  
    // Flip 
    window.flipCard = (playerIndex, cardIndex) => {
      if (currentPlayerIndex === playerIndex && !gameOver) {
        players[playerIndex].hand[cardIndex].faceUp = true;
        updateBoard();
        endTurn();
      }
    };
  
    // new card
    drawButton.addEventListener('click', () => {
      if (deck.length === 0) return;
      const drawnCard = drawCard();
      discardPile.push(drawnCard);
      updateBoard();
      endTurn();
    });
  
    // End the current player's turn
    function endTurn() {
      currentPlayerIndex = (currentPlayerIndex + 1) % 2;
      updateBoard();
    }
  
    setupGame();
  });
  