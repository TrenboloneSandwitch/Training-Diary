var PHASE;

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
});

// Při otevření modalu ulož kde jsi ho otevřel
$('#addExerciseModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var hiddenVal = button.data('phase')
  PHASE = hiddenVal;
});




// Class init
const ui = new UI();


// Event listeners
  // Add exercise listener
  document.querySelector('#add-series-btn').addEventListener('click', createInputs);

  document.querySelector('#remove-series-btn').addEventListener('click', removeLastRowFromModal);
  // remove item listener
  document.querySelector('#container-for-exercises').addEventListener('click', e =>{
    if(e.target.parentNode.classList.contains('remove')){
      removeItem(e.target.parentNode.parentNode.parentNode);  
    };
  });
  // Submit form listener
  document.querySelector('#save-exercise-btn').addEventListener('click', addExercise);

  // Close modal listener
  document.querySelector('.modal').addEventListener('click', e => {
    // Close modal if you click 'X' or 'Zavřít'  
    if (e.target.classList.contains('close-modal')) {

      closeModal();
    }
    e.preventDefault();
  });
/*************************************************************/

// Add Inputs into modal
function createInputs(e) {
  ui.addRowsIntoModal();
  e.preventDefault();
}

function removeLastRowFromModal(e){
  ui.removeLastRowFromModal();
}

function addExercise(e) {
  // Rozhodni jestli jde o rozcvičku nebo hlavní část
  let containerID = '';
  if (PHASE === 'warmUP') {
    containerID = 'warmup-exercises-container';

  } else {
    containerID = 'main-exercises-container';
  };

  const reps = [];
  const series = [];
  const weight = [];
  const name = document.querySelector('#exercise-name-input').value;

  // Nejdřív zjisti jestli vyplnil jméno
  if (typeof name !== 'string' || name === '') {
    ui.showAlert('Název cviku není vyplněn!', 'danger', 'times', '#modal-form', '#exercise-row');
  } else {
    // Zjisti počet řádků
    const numberOfRows = ui.getRowsFromModal().length;
    let noEmptyFields = true;
    // Zapiš hodnoty do příslušných řad
    for (let index = 0; index < numberOfRows; index++) {
      series[index] = document.querySelector(`#exercise-series-input-${index+1}`).value;
      reps[index] = document.querySelector(`#exercise-reps-input-${index+1}`).value;
      weight[index] = document.querySelector(`#exercise-weight-input-${index+1}`).value;

      // Podmínka na vyplnění inputů
      if (series[index] === '' || reps[index] === '' || weight[index] === '') {
        ui.showAlert('Vyplňte prosím všechny údaje!', 'danger', 'times', '#modal-form', '#exercise-row');
        noEmptyFields = false;
        break;
      }
    }
    // Pokud je vše v pořádku, můžeš pokračovat
    if (noEmptyFields) {
      ui.showAlert('Cvik byl úspěšně vložen do seznamu!', 'success', 'check', '#modal-form', '#exercise-row')
      // Objekt s příslušnýma hodnotama
      const exercise = {
        name,
        series,
        reps,
        weight
      };


      // Add into UI
      ui.addExerciseIntoUI(exercise, containerID);
      // Add to Storage
      // Back to default state
      ui.removeAllAdditionallRowsFromModal();
    }
  }
  e.preventDefault();
}

function closeModal() {
  ui.removeAllAdditionallRowsFromModal();
}

function removeItem(item) {
  ui.removeExerciseFromUI(item.parentNode);
  
 // ui.removeExerciseFromUI(item);  
}