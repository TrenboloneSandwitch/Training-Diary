const storage = new Storage1();
const ui = new UI_Summary();

/**
 * Global Vars using module revealling pattern
 */
const globalVars = (function () {
    let exercises;
  
    function setExercises(myvar1) {
        exercises = myvar1;
    }
    
    function getExercises() {
      return exercises;
    }
  
    return {
      setExercises: setExercises,
      getExercises: getExercises
    }
  })();


/**
 * Event listtener for DOM loaded Content
 * Download data from database and fill the page
 */
document.addEventListener('DOMContentLoaded', function () {
    const dataPromise = storage.get('records/');
    dataPromise.then(data => {
        ui.fillList(data);
        ui.toggleEmptyInformationSpan('workouts-list');
    });    
});
/**
 * Event listtener for Controling list
 */
document.querySelector('#workouts-list').addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
      ui.removeSingleRecord(e.target.parentNode.parentNode.parentNode.parentNode);
      ui.toggleEmptyInformationSpan('workouts-list');
    };
  });