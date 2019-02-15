/**
 * LOCAL STORAGE HAndler
 */

 class LocalStorage{
    
     getItems(id){
        let items;
        if (localStorage.getItem(`treninky-${id}`)===null) {
            items = [];
        } else {
            items = JSON.parse(localStorage.getItem(`treninky-${id}`));
        }
        return items;
     }

     addItem(item,id){
        let items = this.getItems(id);

       // localStorag.clear();
        items.push(item);

       localStorage.setItem(`treninky-${id}`, JSON.stringify(item));
     }
 }
