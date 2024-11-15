document.addEventListener("DOMContentLoaded", function() {
    const flipCard = document.querySelector('.flip-card');
    const openSignUp = document.getElementById('openSignUp');
    const openSignIn = document.getElementById('openSignIn');

    openSignUp.addEventListener('click', function() {
        flipCard.classList.add('flipped');
    });

    openSignIn.addEventListener('click', function() {
        flipCard.classList.remove('flipped');
    });
});
