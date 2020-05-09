let input = document.querySelector('input')
let story1 = "All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this. One day when she was two years old she was playing in a garden, and she plucked another flower and ran with it to her mother. I suppose she must have looked rather delightful, for Mrs. Darling put her hand to her heart and cried, “Oh, why can't you remain like this for ever! This was all that passed between them on the subject, but henceforth Wendy knew that she must grow up. You always know after you are two. Two is the beginning of the end. Of course they lived at 14 [their house number on their street], and until Wendy came her mother was the chief one. She was a lovely lady, with a romantic mind and such a sweet mocking mouth. Her romantic mind was like the tiny boxes, one within the other, that come from the puzzling East, however many you discover there is always one more; and her sweet mocking mouth had one kiss on it that Wendy could never get, though there it was, perfectly conspicuous in the right-hand corner."
let story2 = "A salt seller used to carry the salt bag on his donkey to the market every day. On the way they had to cross a stream. One day the donkey suddenly tumbled down the stream and the salt bag also fell into the water. The salt dissolved in the water and hence the bag became very light to carry. The donkey was happy. Then the donkey started to play the same trick every day. The salt seller came to understand the trick and decided to teach a lesson to it. The next day he loaded a cotton bag on the donkey. Again it played the same trick hoping that the cotton bag would be still become lighter. But the dampened cotton became very heavy to carry and the donkey suffered. It learnt a lesson. It didn’t play the trick anymore after that day, and the seller was happy."
let story3 = "Stories that have morals and messages behind them are always powerful. In fact, it’s crazy just how powerful a 200 word story can be. Our last article of short stories became so popular, that we decided to create another list, in which every story has a simple moral behind it. The 10 Best Short Moral Stories Some of these stories are very short and basic. In fact some are so basic they’re most likely featured in children’s books somewhere. However, the strength of the message remains the same. Here’s some more of the best short moral stories: 1. An Old Man Lived in the Village Short Moral Stories."
let array = []

//  function for select story
function storySelection(){
	let select = document.querySelector('select')
	select.addEventListener('change',function(event){
		let selectStory = ""
		console.log(select[select.selectedIndex].id)

		switch(select[select.selectedIndex].id){
			case "1":
			array = story1.split(' ')
			break;
			case "2":
			array = story2.split(' ')
			break;
			case "3":
			array = story3.split(' ')
			break;
		}
	})
	
}
storySelection()
// append every word to an element
function wordsGenerator(){
	let story = document.querySelector('#story')
	let num = 0
	
	for(let item of array){
		console.log(item)
		let newElement = document.createElement('p')
		newElement.textContent = item
		newElement.id = 'para-'+num
		story.appendChild(newElement)
		num++
		
	}
}
wordsGenerator()

let modal = document.querySelector(".starter"); // starter modal
let gameover = document.querySelector(".gameover"); // gameover modal
let start = document.querySelector('#start')
let correct = document.querySelector('#correct')
let error = document.querySelector('#error')
let minute = document.querySelectorAll('#minute')
let word = document.querySelector('#wordToType')
let timeLeft = document.querySelector('#timeLeft')
let seconds = 0; // timer seconds by default
let correctArray = [] // error counter
let errorArray = [] // error counter
let timeout; // setTimeout Variable
let status = "Not GameOver" // game status game is not over by default
let iterator = 0 // iterator for counting each word
let started = false
let wpmOver = document.querySelector(".wpm");
let accOver = document.querySelector(".acc");
let errorOver = document.querySelector(".error");


// this function is going to be called after the page is loaded
function timerSelection(){
	// Selection of Minutes
	modal.style.display = "block";
	for(let min of minute){
		min.addEventListener('click',function(event){
			console.log(event.target.getAttribute('data-custom-value'))
			if(array.length == 0) { array = story1.split(' ') } // if user has not chosen any story the first one will be default
			modal.style.display = "none"
			seconds = event.target.getAttribute('data-custom-value')
			timeLeft.textContent = "Time Left: " +convertMiliseconds(seconds,'s')+ "s";
			 wordsGenerator()
			if(seconds != 0){ start.disabled = false } // enable start button after selecting timer
			minute.disabled = true
		})
	}
}



// when the start button is clicked it will go to else
function init(reset=false){
	if(reset == true){ 
		//location.reload()
		resetTimer(timeout)
		location.reload()
		startType()
	}else{ 
		word.textContent = 'Word: '+array[0] // Display the first word
		startType()
	 }
}

// input event 
function startType(){
	let inputValue = ""
	console.log(status)
	input.addEventListener('keydown',function(event){
		started = true
		if(status != "GameOver"){
			timeout = window.setTimeout(startTimer,seconds)
		}
	    if(event.keyCode == 13 || event.keyCode == 32 ){
	    	inputValue = this.value.replace(/ /g,'');
	      	if(iterator != array[array.length-1]){
	      		let elem = document.querySelector('#para-'+iterator) // selector to change each text color
				word.textContent = 'Word: '+array[iterator+1]
				// If game is over
				if(typeof array[iterator] == "undefined"){	
					input.disabled = true
					resetTimer(interval)
					restart.disabled = false
					return gameOver()
				}
				// If submitted word was correct, otherwise wrong
				if(inputValue == array[iterator]){
					elem.style.color = "green"
					correctArray.push(inputValue)
					iterator++
				}else{ 
					elem.style.color = "red"
					errorArray.push(inputValue)	
					iterator++ 
				}	
	      	}
	      	// Count the number of correct and error
	      	correct.textContent = 'Correct: '+correctArray.length
	      	error.textContent = 'Errors: '+errorArray.length

	      	// Count the number and display on modal when game is over
	      	let wpmResult = correctArray.length / 5;
	      	wpmOver.textContent = 'WPM: '+wpmResult
	      	errorOver.textContent = 'Errors: '+errorArray.length
	      	let accuracyResult = correctArray.length/array.length * 100
	      	accOver.textContent = 'Accuracy: '+accuracyResult.toFixed(2)+"%"
	      	input.value = "" // remove input
	    }
	})	

	// Time Starts
	let ms = convertMiliseconds(seconds,'s')
	let interval = setInterval(function(){
		timeLeft.textContent = 'Time Left: '+ ms-- + "s"
			if(ms < 0){
				clearTimeout(interval)
				gameOver()
			}
	},1000)
	
}

function startTimer(){
	input.value = ""
	input.disabled = true
	status = "GameOver"
	restart.disabled = false
}

function resetTimer(timer){
	status = "Not GameOver"
	return clearTimeout(timer)
}

// Start Button
start.addEventListener('click',function(){
	init() 
	input.disabled = false // remove the input disable
	this.textContent = "Restart"
	this.removeAttribute= "id"
	this.setAttribute("id","restart")
	// Restart Button
	let restart = document.querySelector('#restart')
	restart.addEventListener('click',() => init(true))
})

// this function will be called when the word reaches the end or the time went out
function gameOver(){
	gameover.style.display = "block";
}

function convertMiliseconds(miliseconds, format) {
  var days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
  
  total_seconds = parseInt(Math.floor(miliseconds / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);
  
  switch(format) {
	case 's':
		return total_seconds;
	case 'm':
		return total_minutes;
	case 'h':
		return total_hours;
	case 'd':
		return days;
	default:
		return { d: days, h: hours, m: minutes, s: seconds };
  }
};