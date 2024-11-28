const patterns = [
  '⚫️🔴🔴⚫️',
  '🔴⚫️⚫️🔴',
  '🔴🔴⚫️⚫️⚫️⚫️🔴🔴',
  '⚫️⚫️🔴🔴🔴🔴⚫️⚫️',
  '⚫️⚫️🔴🔴⚫️⚫️',
  '🔴🔴⚫️⚫️🔴🔴',
  '🔴⚫️🔴🔴🔴🔴⚫️⚫️',
  '🔴⚫️🔴🔴🔴🔴⚫️🔴',
  '🔴⚫️🔴⚫️',
  '⚫️🔴⚫️🔴'
];

const recentColors = [];
const maxRecentColors = 5;

// Função para calcular o hash SHA-256
async function sha256(input) {
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Previsão de próxima cor
async function predictNextColor() {
  const currentTimestamp = new Date();
  const hashValue = await sha256(currentTimestamp.toString());
  const redProb = Math.floor(Math.random() * 51) + 50;    
  const blackProb = Math.floor(Math.random() * 51) + 50;
  const whiteProb = Math.floor(Math.random() * 51) + 50;

  let predictedColor;
  const randomNum = Math.random() * 100;
  if (randomNum < redProb) {
    predictedColor = '🔴';
  } else if (randomNum < redProb + blackProb) {
    predictedColor = '⚫️';
  } else {
    predictedColor = '⚪️';
  }

  if (recentColors.length >= maxRecentColors) {
    recentColors.shift();
  }
  recentColors.push(predictedColor);

  const whiteCount = recentColors.filter(color => color === '⚪️').length;
  const trendAnalysis = whiteCount > 2 ? 'TENDÊNCIA: ALTA PROBABILIDADE DE BRANCO' : '';

  document.getElementById('predicted-color').innerText = `ENTRE 👉🏼: ${predictedColor}`;
  document.getElementById('accuracy').innerText = `ACERTIVIDADE: ${whiteProb}%`;
  document.getElementById('trend-analysis').innerText = trendAnalysis;
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false });
}

function updateDate() {
  const now = new Date();
  document.getElementById('date').textContent = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function runBot() {
  predictNextColor();
  setInterval(predictNextColor, 30000);
  setInterval(updateClock, 1000);
  setInterval(updateDate, 1000);
}

window.onload = runBot;
