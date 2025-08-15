document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const situationInput = document.getElementById('situationInput');

    if (startBtn && situationInput) {
        startBtn.addEventListener('click', () => {
            const situation = situationInput.value.trim();
            if (!situation) {
                alert("Please enter your situation first!");
                return;
            }
            try {
                localStorage.setItem("userSituation", situation);
                localStorage.setItem("gamesCompleted", "0");
                window.location.href = "game1.html";
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert("Error saving your situation. Please try again.");
            }
        });
    }
});
