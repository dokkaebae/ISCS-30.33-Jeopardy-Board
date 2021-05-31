function get_categories() {
    console.log("getting category...");
    let trivia = fetch("http://jservice.io/api/categories?count=6").then(response => { 
        if(!response.ok){
            throw Error(response.statusText);
        }
        return response;
    }).then(j_response => {
        return j_response.json();
    }).catch(error => {
        console.log(error);
    })
    return trivia;
;}

function display_questions() {
    console.log("displaying categories...")
    Promise.resolve(get_categories()).then(cat => {
        console.log(cat);
    })
}

display_questions();