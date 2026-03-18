import './style.css'

// 1. Apna NGROK URL yahan dalein
const API_URL = "https://mensurable-brande-southbound.ngrok-free.dev/analyze-credit";

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Intelli-Credit AI 🚀</h1>
    <p>Enter business details for instant AI risk analysis.</p>
    
    <div class="card">
      <input type="text" id="company_name" placeholder="Company Name" />
      <input type="number" id="revenue" placeholder="Annual Revenue ($)" />
      <input type="number" id="total_debt" placeholder="Total Debt ($)" />
      <button id="analyze-btn">Analyze Credit</button>
    </div>

    <div id="result-section" style="margin-top: 20px; display: none;">
      <h2>Result: <span id="decision-text"></span></h2>
      <p id="ai-report" style="background: #f4f4f4; padding: 15px; border-radius: 8px; color: #333;"></p>
    </div>
  </div>
`

// 2. Button Click Functionality
document.querySelector('#analyze-btn').addEventListener('click', async () => {
    const btn = document.querySelector('#analyze-btn');
    const resultSection = document.querySelector('#result-section');
    
    // UI Loading state
    btn.innerText = "Analyzing...";
    btn.disabled = true;

    const payload = {
        company_name: document.querySelector('#company_name').value,
        revenue: parseFloat(document.querySelector('#revenue').value) || 0,
        total_debt: parseFloat(document.querySelector('#total_debt').value) || 0
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // 3. UI par result dikhana
        resultSection.style.display = 'block';
        document.querySelector('#decision-text').innerText = data.decision;
        document.querySelector('#ai-report').innerText = data.ai_analysis;
        
    } catch (error) {
        alert("Backend not connected! Make sure uvicorn and ngrok are running.");
        console.error(error);
    } finally {
        btn.innerText = "Analyze Credit";
        btn.disabled = false;
    }
});
