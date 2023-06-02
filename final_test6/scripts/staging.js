const buttonStart = document.querySelector('#start')

buttonStart.addEventListener('click', () => {
  document.querySelector('#background-music').play();

  setTimeout(() => {
    buttonStart.style.display = 'none';

    createParticles();
    animate();
  }, 500)
})