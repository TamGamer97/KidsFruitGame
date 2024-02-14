const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var fruitList = []
const AngryBirdSpeed = 5


class Fruit{
    constructor(fruit, x, y, isTouched)
    {
        this.fruit = fruit
        this.x = x
        this.y = y
        this.isTouched = isTouched 
    }

    spawn()
    {

        const fruit = new Image(60, 45);
        fruit.src = "Assets/Foods/"+this.fruit+".png";

        ctx.drawImage(fruit, this.x, this.y, 85, 85)
    }
}

// https://characters.design/service/2d-character-design/
class Character{
    constructor(name, x=(canvas.width / 2) - (200 /2), view='Front')
    {
        this.name = name
        this.x = x
        this.view = view
    }

    spawn()
    {

        const fruit = new Image(60, 45);
        fruit.src = "Assets/Charectors/"+this.name+"/"+this.view+".png";

        ctx.drawImage(fruit, this.x , canvas.height - 200, 200, 200)
    }
}


const AngryBird = new Character('AngryBird')


function createFruit()
{
    const fruitNames = ['Watermelon', 'Pizza', 'Blueberry', 'Strawberry', 'Coconut', 'Orange', 'Grape', 'Cheese', 'IceCream', 'Pineapple']

    const name = fruitNames[Math.floor((Math.random()*fruitNames.length))] // random fruit
    const fruit = new Fruit(name, (canvas.width / 2) - 42.5, 30, false) // init random fruit

    fruitList.push(fruit)
}

async function Update()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas
    ctx.beginPath();

    // trasnaprent red circle for fruit spawn
    ctx.beginPath();
    ctx.arc((canvas.width / 2), 75, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 0,0,0.1)'
    ctx.fill();

    AngryBird.view = 'front' // setting default view for charecter
    var currentSpeed = AngryBirdSpeed

    for (f in fruitList)
    {
        fruitList[f].spawn() // initialy spawing fruit

        if(fruitList[f].y > canvas.height - 200) // checking if fruit is on land (same y cords as player)
        {
            console.log('ready to be eaten')
            if(AngryBird.x > fruitList[f].x) // if fruit is towards the left of charecter
            {
                if(AngryBird.x - fruitList[f].x >= 10) // if charecter is not within 10 pixels left of the fruit
                {
                    currentSpeed = (AngryBird.x - fruitList[f].x) / 50
                    if(currentSpeed < 5) {currentSpeed = 5}
                    AngryBird.x -= currentSpeed // moving charecter by speed
                    AngryBird.view = 'Left' // setting state of charecter
                }else{
                    console.log('Eat ' + fruitList[f].fruit)
                    fruitList.pop(f) // removing fruit
                    createFruit() // initilising a new random fruit
                }
            }else{ // if fruit is towards the right of charecter
                if(fruitList[f].x - AngryBird.x >= 10) // if charecter is not within 10 pixels right of the fruit
                {
                    currentSpeed = (fruitList[f].x - AngryBird.x) / 50 
                    if(currentSpeed < 5) {currentSpeed = 5}
                    AngryBird.x += currentSpeed // moving charecter by speed
                    AngryBird.view = 'Right' // setting state of charecter
                }else{
                    console.log('Eat ' + fruitList[f].fruit)
                    fruitList.pop(f) // removing fruit
                    createFruit() // initilising a new random fruit
                }
            }

        }
    }

    AngryBird.spawn() // placing the charecter after adjusstments (movement, state)

    requestAnimationFrame(Update)
}

function events()
{
    document.addEventListener('mousedown', (event)=> {
        
        // on mouse down checking if the mouse is clicking the fruit

        var xPos = event.clientX 
        var yPos = event.clientY
        console.log(xPos)
        console.log(yPos)

        for (f in fruitList)
        {
            if(xPos > fruitList[f].x && xPos < fruitList[f].x + 100)
            {
                if(yPos > fruitList[f].y && yPos < fruitList[f].y + 100)
                {
                    console.log('touched ' + fruitList[f].fruit)
                    fruitList[f].isTouched = true
                }
            }
        }

    })
    document.addEventListener('mouseup', (event) => {

        // on mouse up removing is_touch factor for the fruit

        for (f in fruitList)
        {
            if(fruitList[f].isTouched == true)
            {
                fruitList[f].isTouched = false
            }
        }
    })

    document.addEventListener('mousemove', (event) => {

        // if is_touch factor is true then set fruits position to mouses position - offets to center fruit to cursor 

        var xPos = event.clientX
        var yPos = event.clientY

        for (f in fruitList)
        {
            if(fruitList[f].isTouched == true)
            {
                fruitList[f].x = xPos - 50
                fruitList[f].y = yPos - 50
            }
        }

    })
}



createFruit()
events()
Update()