const canvas = document.querySelector("#GameScreen");
const c = canvas.getContext("2d");

var gravity = 0.05;
var gravitySpeedMax = 10
var object_list = []

class box {
    constructor({ pos, size, gravityLocal, id}) {
        this.pos = pos
        this.size = size
        this.gravitySpeed = 0
        this.gravityLocal = gravityLocal
        this.speedX = 0
        this.speedY = 0
        this.id = id
        this.onGround = false
        this.hitGround = function() {
            var floor = canvas.height - this.size.y;
            if (this.pos.y > floor) {
                this.pos.y = floor;
                this.onGround = true
            }
            //!
            object_list.forEach((e, index) => {
                if (this.id != e.id) {
                    var bad = false
                    var colision = e.pos.y - this.size.y
                    if(this.pos.x+this.size.x <= e.pos.x+this.size.x && this.pos.x+this.size.x >= e.pos.x) {
                        bad = true
                    }
                    if(this.pos.x > e.pos.x && this.pos.x < e.pos.x+e.size.x) {
                        bad = true
                    }    
                    if(bad == true) {
                        if(this.pos.y > colision && this.pos.y+this.gravityLocal <= colision+e.size.y+this.gravitySpeed) {
                            this.pos.y = colision
                            this.onGround = true
                        }
                    }
                }
            })
            //!
            // if (this.id == 0) {
            //     var bad = false
            //     var colision = box2.pos.y - this.size.y
            //     // PRAWA STRONA
            //     if(this.pos.x+this.size.x <= box2.pos.x+this.size.x && this.pos.x+this.size.x >= box2.pos.x) {
            //         // LEWA STRONA
            //         bad = true
            //     }
            //     if(this.pos.x > box2.pos.x && this.pos.x < box2.pos.x+box2.size.x) {
            //         bad = true
            //     }    
            //     if(bad == true) {
            //         if(this.pos.y > colision) {
            //             this.onGround = true
            //             this.pos.y = colision
            //         }
            //     }
            // }
        }
    }

    draw() {
        c.fillStyle = 'red'
        c.strokeStyle = 'white'
        c.lineWidth = 1;
        // c.fillRect(this.pos.x,this.pos.y, 50, 50)
        c.strokeRect(this.pos.x,this.pos.y, this.size.x, this.size.y);
        c.beginPath();
        c.strokeStyle = 'red'
        c.moveTo(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2); //stawiamy piórko w punkcie x: 20 y: 20
        c.lineTo(this.pos.x + this.size.x, this.pos.y + this.size.y/2); //zaczynamy rysować niewidzialną linię do x : 30, y: 40
        c.stroke(); //po zakończeniu rysowania obrysowujemy linię
    }
    update() {
        this.onGround = false
        this.hitGround()
        this.draw()
        if(this.onGround == false) {
            if (this.gravitySpeed < gravitySpeedMax) {
                this.gravitySpeed += this.gravityLocal;
            }
            this.pos.y += this.speedY + this.gravitySpeed;
        } else {
            this.gravitySpeed = 0
        }
        
        console.warn(box1);
    }
}

const box1 = new box({
    pos: {
        x: 50,
        y: 150
    },
    size: {
        x: 100,
        y: 50,
    },
    gravityLocal: 0.05,
    id: 0
})

const box2 = new box({
    pos: {
        x: 250,
        y: 20
    },
    size: {
        x: 100,
        y: 100,
    },
    gravityLocal: 0.05,
    id: 1
})

object_list.push(box1)
object_list.push(box2)

function clear() {
    c.fillStyle = '#1f2335'
    c.fillRect(0, 0, canvas.width, canvas.height)
}

function animate() {
    window.requestAnimationFrame(animate)
    clear()
    // console.warn(box1);
    box1.update()
    box2.update()
}
animate()

var mouseX, mouseY
var hoverObject = undefined
var clicked = false
var saveGravityLocal, saveGravitySpeed

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    event = event || window.event;
    // 
    mouseX = event.pageX - canvas.offsetLeft
    mouseY = event.pageY - canvas.offsetTop
    // 
    if(hoverObject != undefined && clicked == true) {
        hoverObject.pos.x = mouseX - hoverObject.size.x/2
        hoverObject.pos.y = mouseY - hoverObject.size.y/2
        // 
        // 
        hoverObject.gravityLocal = 0
        hoverObject.gravitySpeed = 0
    }
}

document.onmousedown = mouseDown;
function mouseDown() {
    hoverObject = undefined
    object_list.forEach((e, index) => {
        if (mouseX >= e.pos.x && mouseX <= e.pos.x+e.size.x &&
            mouseY >= e.pos.y && mouseY <= e.pos.y+e.size.y) {
            // 
            hoverObject = e
            console.warn(hoverObject);
            // 

        }
    })
    clicked = true
    if(hoverObject != undefined ) {
        saveGravityLocal = hoverObject.gravityLocal
        // saveGravitySpeed = hoverObject.gravitySpeed
        saveGravitySpeed = 0
    }
}
document.onmouseup = mouseUp;
function mouseUp() {
    clicked = false
    if(hoverObject != undefined ) {
        hoverObject.gravityLocal = saveGravityLocal
        hoverObject.gravitySpeed = saveGravitySpeed
    }
}