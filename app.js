let questions_arr = [];
let answers_arr = [];
let selected;

let question_grid = document.querySelectorAll(".question-block");
let question_row = document.querySelectorAll(".question-row");
let submit_btn = document.querySelector("#answer-submit");

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

function hide_questions() {
    let val = 0;
    question_row.forEach(function(row) {
        if (val === 0) {
            val += 200;
        } else {
            for (let i = 1; i <= 11; i+=2) {
                if (row.childNodes[i].classList.contains("answered")) {
                    continue;
                }
                row.childNodes[i].textContent = "$"+val;
            }
            // row.childNodes[1].textContent = "$"+val;
            // row.childNodes[3].textContent = "$"+val;
            // row.childNodes[5].textContent = "$"+val;
            // row.childNodes[7].textContent = "$"+val;
            // row.childNodes[9].textContent = "$"+val;
            // row.childNodes[11].textContent = "$"+val;
            val+=200;
        }
    })
    question_grid.forEach(function(block) {
        block.classList.replace("question", "hidden");
    })
}

function display_questions() {
    let promise_arr = [];

    console.log("displaying categories...")
    Promise.resolve(get_categories()).then(cat => {
       return cat;
    }).then(cat => {
        return Promise.all(push_question(cat, promise_arr));
    }).then(response => {
        for(let i = 0; i < 6; i++) {
            question_grid[0+i].textContent = response[i].title;
            question_grid[6+i].textContent = response[i].clues[0].question;
            question_grid[12+i].textContent = response[i].clues[1].question;
            question_grid[18+i].textContent = response[i].clues[2].question;
            question_grid[24+i].textContent = response[i].clues[3].question;
            question_grid[30+i].textContent = response[i].clues[4].question;
        }
        for(let i = 6; i < question_grid.length; i++) {
            questions_arr.push(question_grid[i].textContent);
        }
        for(let i = 0; i < 6; i++) {
            question_grid[0+i].textContent = response[i].title;
            question_grid[6+i].textContent = response[i].clues[0].answer;
            question_grid[12+i].textContent = response[i].clues[1].answer;
            question_grid[18+i].textContent = response[i].clues[2].answer;
            question_grid[24+i].textContent = response[i].clues[3].answer;
            question_grid[30+i].textContent = response[i].clues[4].answer;
        }
        for(let i = 6; i < question_grid.length; i++) {
            answers_arr.push(question_grid[i].textContent);
        }
        console.log(questions_arr);
        console.log(answers_arr);
        hide_questions();
    })
}

// the setup
display_questions();


// user interaction
function select_question() {
    question_grid.forEach(function(block) {
        block.addEventListener("click", function() {
            if (this.classList.contains("hidden")) {
                hide_questions();
                this.textContent = questions_arr[this.id]
                this.classList.replace("hidden", "question");
                selected = this.id;
            }
        })
        
    })
}

submit_btn.addEventListener("click", function(event) {
    event.preventDefault();
    if(selected==null) {
        alert("Please select a question first.")
    } else {
        var ans = document.querySelector("#answer");
        if (ans.value.toUpperCase() == answers_arr[selected].toUpperCase()) {
            console.log("correct");
        }
    }
})

select_question();
// css text stroke: https://www.codesdope.com/blog/article/adding-outline-to-text-using-css/
// hide scrollbars: https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp
// prevent refresh after submit: https://devnet.kentico.com/questions/prevent-page-refreshing-when-clicking-a-button
