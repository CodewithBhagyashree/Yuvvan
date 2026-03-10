import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // Top Right Calculator Toggle
    const calcToggleBtn = document.getElementById('calcToggleBtn');
    const calcWidget = document.getElementById('calcWidget');
    const closeCalcBtn = document.getElementById('closeCalcBtn');
    const modeBasic = document.getElementById('modeBasic');
    const modeCredit = document.getElementById('modeCredit');
    const calcMainArea = document.getElementById('calcWidget');

    calcToggleBtn.addEventListener('click', () => {
        calcWidget.classList.add('open');
    });

    closeCalcBtn.addEventListener('click', () => {
        calcWidget.classList.remove('open');
    });

    modeBasic.addEventListener('click', () => {
        modeBasic.classList.add('active');
        modeCredit.classList.remove('active');
        calcMainArea.classList.remove('calc-mode-credit');
    });

    modeCredit.addEventListener('click', () => {
        modeCredit.classList.add('active');
        modeBasic.classList.remove('active');
        calcMainArea.classList.add('calc-mode-credit');
    });

    // Chat Widget Toggle
    const copilotFab = document.getElementById('copilotFab');
    const chatWidget = document.getElementById('chatWidget');
    const closeChatBtn = document.getElementById('closeChatBtn');

    copilotFab.addEventListener('click', () => {
        chatWidget.classList.add('active');
    });

    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // 3D Tilt Effect on Stat Cards
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.boxShadow = `0 15px 35px rgba(0,0,0,0.3)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.boxShadow = `var(--glass-shadow)`;
        });
    });

    // Data Ingestion Drag and Drop (Simulated)
    const setupDropZone = (zoneId, fileNameSim) => {
        const zone = document.getElementById(zoneId);
        const terminal = document.getElementById('terminalLog');

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--ai-cyan)';
            zone.style.background = 'rgba(6, 182, 212, 0.1)';
        });

        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            zone.style.background = 'rgba(30, 41, 59, 0.3)';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--color-success)';
            zone.style.background = 'rgba(16, 185, 129, 0.1)';

            // Add terminal log safely
            const cursor = terminal.querySelector('.cursor');
            if (cursor) cursor.remove();

            const p1 = document.createElement('p');
            p1.textContent = `> Uploading ${fileNameSim}...`;
            terminal.appendChild(p1);

            setTimeout(() => {
                const p2 = document.createElement('p');
                p2.textContent = `> Validating schema...`;
                terminal.appendChild(p2);

                setTimeout(() => {
                    const p3 = document.createElement('p');
                    p3.textContent = `> Success. Data ingested into Vector DB.`;
                    p3.style.color = 'var(--ai-cyan)';
                    terminal.appendChild(p3);

                    const newCursor = document.createElement('p');
                    newCursor.innerHTML = `> <span class="cursor"></span>`;
                    terminal.appendChild(newCursor);
                    terminal.scrollTop = terminal.scrollHeight;
                }, 800);
            }, 500);
        });

        zone.addEventListener('click', () => {
            // Trigger drop logic for click as well
            zone.dispatchEvent(new Event('drop'));
        });
    };

    setupDropZone('structuredZone', 'GST_BankStmt.csv');
    setupDropZone('unstructuredZone', 'AnnualReport_FY24.pdf');

    // Chat Logic
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    const chatBody = document.getElementById('chatBody');
    const typingIndicator = document.getElementById('typingIndicator');
    const chips = document.querySelectorAll('.chip');

    const scrollToBottom = () => {
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const addMessage = (text, isUser = false) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user' : 'ai'}`;
        bubble.textContent = text;

        // Remove typing indicator temporarily
        typingIndicator.style.display = 'none';

        chatBody.appendChild(bubble);
        scrollToBottom();
    };

    const simulateAiResponse = (userText) => {
        // Show typing
        chatBody.appendChild(typingIndicator);
        typingIndicator.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            let response = "";
            if (userText.toLowerCase().includes("gst") || userText.toLowerCase().includes("bank")) {
                response = "I detected a 24% variance between GSTR-3B declared sales and inward bank remittances. Cross-leveraging transaction hashes suggests potential circular trading among 3 related parties.";
            } else if (userText.toLowerCase().includes("premium") || userText.includes("12.5%")) {
                response = "The 12.5% risk premium is derived from: Base rate (8.0%) + Litigation Penalty (2.5%) + DSCR shortfall sub-charge (2.0%).";
            } else {
                response = "Analyzed. The document context highlights high litigation risks which severely affects the credit scoring matrices. Would you like me to draft a localized mitigant note?";
            }
            addMessage(response, false);
        }, 1500);
    };

    const handleSend = () => {
        const val = chatInput.value.trim();
        if (val) {
            addMessage(val, true);
            chatInput.value = '';
            simulateAiResponse(val);
        }
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.textContent;
            addMessage(text, true);
            simulateAiResponse(text);
        });
    });

    // Primary Insight Portal Glow Button Animation
    const btnAi = document.querySelector('.btn-ai');
    if (btnAi) {
        btnAi.addEventListener('click', () => {
            const originalText = btnAi.innerHTML;
            btnAi.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
            setTimeout(() => {
                btnAi.innerHTML = '<i class="ph ph-check"></i> Analysis Complete';
                setTimeout(() => {
                    btnAi.innerHTML = originalText;
                }, 2000);
            }, 1000);
        });
    }
});

// Calculator Global Functions
window.calcMem = "";
window.clearCalc = () => {
    document.getElementById('calcRes').innerText = "0";
    document.getElementById('calcMem').innerText = "";
    window.calcMem = "";
};

window.appendToCalc = (val) => {
    const res = document.getElementById('calcRes');
    if (res.innerText === "0" && val !== ".") {
        res.innerText = val;
    } else {
        res.innerText += val;
    }
};

window.calculateResult = () => {
    try {
        const res = document.getElementById('calcRes');
        document.getElementById('calcMem').innerText = res.innerText + " =";
        // Safe evaluation for basic math
        const evaluated = new Function('return ' + res.innerText)();
        res.innerText = Number.isInteger(evaluated) ? evaluated : evaluated.toFixed(2);
    } catch (e) {
        document.getElementById('calcRes').innerText = "Error";
    }
};

window.calculateEMI = () => {
    const p = parseFloat(document.getElementById('c_loan').value);
    const r = parseFloat(document.getElementById('c_rate').value) / (12 * 100); // monthly interest
    const n = parseFloat(document.getElementById('c_tenure').value); // months

    if (!p || !r || !n) {
        document.getElementById('calcRes').innerText = "Err: Input";
        return;
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    // Simple dummy DSCR assumption for UI purpose
    const cashFlow = emi * 1.5; // Simulate 1.5x DSCR available cash
    const dscr = cashFlow / emi;

    document.getElementById('calcMem').innerText = `EMI: ₹${Math.round(emi).toLocaleString('en-IN')}`;
    document.getElementById('calcRes').innerText = `DSCR: ${dscr.toFixed(2)}x`;
};
