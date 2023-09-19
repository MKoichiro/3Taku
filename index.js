'use strict';

{
  
  let nOfQ;

  const optionLabels = document.querySelectorAll('.option label');
  optionLabels[0].style.borderLeft = '3px solid var(--color-a)';
  optionLabels.forEach(label => {
    label.addEventListener('click', () => {
      optionLabels.forEach(label =>{
        label.style.borderLeft = '3px solid transparent';
      });
      label.style.borderLeft = '3px solid var(--color-a)';
    });
  });



  document.querySelector('h1').addEventListener('click', () => {
    document.querySelectorAll('input').forEach(input => {
      if (input.checked) { nOfQ = Number(input.value); }
    });
    console.log(nOfQ);
  });


  document.querySelector('a#start').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('clicked');
    document.querySelector('hr.veal').classList.add('reveal');

    document.querySelectorAll('input').forEach(input => {
      if (input.checked) { nOfQ = Number(input.value); }
    });

    // localStorage.setItem('key', JSON.stringify(aHistories));
    localStorage.setItem('nOfQ', nOfQ);

    setTimeout(() => {
      location.href = "quize.html";
    }, 950);

  });
}