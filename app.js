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

function get_question(cat_id) {
    console.log("getting question...");
    let question = fetch("http://jservice.io/api/category?id=" + cat_id).then(response => {
        if(!response.ok){
            throw Error(response.statusText);
        }
        return response;
    }).then(j_response => {
        return j_response.json();
    }).catch(error => {
        console.log(error);
    })
    return question;
}

function push_question(arr_1, arr_2) {
    for(let i = 0; i < 6; i++) {
        var cat_id = arr_1[i].id;
        var questions = Promise.resolve(get_question(cat_id));
        arr_2.push(questions);
    }
    return arr_2;
}

function display_questions() {
    let questions_arr = [];
    console.log("displaying categories...")
    Promise.resolve(get_categories()).then(cat => {
       return cat;
    }).then(cat => {
        return Promise.all(push_question(cat, questions_arr));
    }).then(response => {
        response.forEach(function(res) {
            console.log("category: " + res.title);
            console.log(res.clues);
        })
    })
}

display_questions();