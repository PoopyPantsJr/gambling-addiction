document.addEventListener('DOMContentLoaded', () => {
  // Toggle theme
  const toggleBtn = document.getElementById('toggleTheme');
  toggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    }
  });

  // Handle event card click (demo only)
  const eventCards = document.querySelectorAll('.event-card');
  const gameDetail = document.getElementById('game-detail');
  const gameTitle = document.getElementById('game-title');
  const marketsContainer = document.getElementById('markets-container');

  eventCards.forEach(card => {
    card.addEventListener('click', () => {
      const matchup = card.querySelector('h4').textContent;
      gameTitle.textContent = matchup;
      marketsContainer.innerHTML = `
        <div class="market-option">
          <span>${matchup.split(' vs ')[0]}</span>
          <button onclick="addToSlip('${matchup.split(' vs ')[0]}', 1.90)">+</button>
        </div>
        <div class="market-option">
          <span>${matchup.split(' vs ')[1]}</span>
          <button onclick="addToSlip('${matchup.split(' vs ')[1]}', 1.90)">+</button>
        </div>
      `;
      gameDetail.style.display = 'block';
    });
  });

  // Place bet button logic
  const placeBetBtn = document.getElementById('place-bet-btn');
  if (placeBetBtn) {
    placeBetBtn.addEventListener('click', () => {
      const amount = prompt('Enter bet amount:');
      if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        alert(`Bet of $${parseFloat(amount).toFixed(2)} placed successfully!`);
        document.getElementById('slip-items').innerHTML = '';
        slipItems.clear();
        updatePayout();
      } else {
        alert('Invalid bet amount.');
      }
    });
  }

  const confirmBtn = document.getElementById('confirm-bet-btn');
  const amountInput = document.getElementById('bet-amount');

  if (amountInput) {
    amountInput.addEventListener('input', updatePayout);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const amount = parseFloat(amountInput.value);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid bet amount.");
        return;
      }
      if (slipItems.size === 0) {
        alert("Please add at least one team to your betting slip.");
        return;
      }

      const betSummary = Array.from(slipItems.entries())
        .map(([team, odds]) => `${team} @ ${odds}`)
        .join('\n');

      alert(`Bet Confirmed!\n\nAmount: $${amount.toFixed(2)}\nTeams:\n${betSummary}`);

      const ul = document.getElementById('slip-items');
      ul.innerHTML = '';
      slipItems.clear();
      amountInput.value = '';
      updatePayout();
    });
  }
});

const slipItems = new Map();

function addToSlip(team, odds) {
  if (slipItems.has(team)) {
    alert(`You've already placed a bet on ${team}.`);
    return;
  }

  const ul = document.getElementById('slip-items');
  const li = document.createElement('li');
  li.textContent = `${team} @ ${odds}`;
  li.dataset.team = team;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '✖';
  removeBtn.style.marginLeft = '10px';
  removeBtn.onclick = () => {
    slipItems.delete(team);
    ul.removeChild(li);
    updatePayout();
  };

  li.appendChild(removeBtn);
  ul.appendChild(li);
  slipItems.set(team, odds);

  updatePayout();
}

function updatePayout() {
  const payoutDiv = document.getElementById('potential-payout');
  const amountInput = document.getElementById('bet-amount');
  const amount = parseFloat(amountInput?.value);

  if (!amount || amount <= 0 || slipItems.size === 0) {
    payoutDiv.textContent = '';
    return;
  }

  let combinedOdds = 1;
  for (let [, odds] of slipItems) {
    combinedOdds *= parseFloat(odds);
  }

  const potential = (combinedOdds * amount).toFixed(2);
  payoutDiv.textContent = `Potential payout: $${potential}`;
}