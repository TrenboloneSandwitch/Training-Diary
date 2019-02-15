class Storage1 {
    constructor() {
        // Get a reference to the database service
        this.database = firebase.database();
    }

    create(exercise) {
        this.database.ref('records/' + exercise.id).set({
            name: exercise.name,
            difficulty: exercise.difficulty,
            notes: exercise.notes,
            warmup: exercise.warmup,
            main: exercise.main,
        }, function (error) {
            if (error) {
                console.log('Chyba');

            } else {
                console.log('data úspešně vloženy');

            }
        });
    }

    get(col) {
        var leadsRef = firebase.database().ref(col);
        return leadsRef.once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(err => console.log('Neočekávaná chyba databáze.' + err));
    }

}