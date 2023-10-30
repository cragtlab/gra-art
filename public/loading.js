/*

  #container {
            position: relative;
            
            transition: opacity 2s;
        }

        #container canvas,
        #overlay {
            background: beige;
            position: absolute;
            align-items: center;
            justify-content: center;
        }
 
        <div id="container">
        <canvas id="loadingCanvas"></canvas>
        <div id="overlay">   
            <h2>Scan To Join The MetaVerse (Limited to 30 pax)</h2>
            <img width="320" height="320" align="left" />
            <h2>Explorer or Web3 Wallet User?</h2>
            <button onclick="var name=prompt('Enter Name');if(name){loaded=true;}" style="width: 30%">Explore</button>
            <br/><b>OR</b>
            <br/><button onclick="loaded=true" style="width: 30%">Web3 Wallet User</button>
        </div>
    </div>


<script src="loading.js"></script>
	
    till 5,6
...
 requestAnimationFrame(animate);
            if (!loaded) {
                return;
            }
*/
let loaded = false, currentChoice=1;
xxx(); function xxx() {
    const canvas = document.getElementById('loadingCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.background = "beige";
    let fruits = [];
    let score = 0;

    // Fruit class
    class Fruit {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
        }
    }

    // Create a new fruit
    function createFruit() {
        const radius = Math.random() * 30 + 10; // Random radius between 10 and 40
        const x = Math.random() * (canvas.width - 2 * radius) + radius;
        const y = canvas.height + radius;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`; // Random color
        const velocity = {
            x: (Math.random() - 0.5) * 8, // Random x velocity
            y: -Math.random() * 5, // Random y velocity (upward)
        };
        fruits.push(new Fruit(x, y, radius, color, velocity));
    }

    // Slice a fruit
    function sliceFruit(index) {
        const slicedFruit = fruits[index];
        const x = slicedFruit.x;
        const y = slicedFruit.y;
        const radius = slicedFruit.radius;

        // Create two new fruits as if the original fruit was sliced
        for (let i = 0; i < 2; i++) {
            fruits.push(new Fruit(x, y, radius / 2, slicedFruit.color, { x: Math.random() - 0.5, y: -Math.random() }));
        }

        // Remove the sliced fruit
        fruits.splice(index, 1);

        // Increase the score
        score += 10;
    }

    // Handle click/touch events
    function handleSlice(event) {
        const clickX = event.clientX || event.touches[0].clientX;
        const clickY = event.clientY || event.touches[0].clientY;

        for (let i = 0; i < fruits.length; i++) {
            const dx = clickX - fruits[i].x;
            const dy = clickY - fruits[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < fruits[i].radius) {
                sliceFruit(i);
                break;
            }
        }
    }

    canvas.addEventListener('mousedown', handleSlice);
    canvas.addEventListener('touchstart', handleSlice);

    // Game loop
    function gameLoop() {
        // wait for character Choice          
        /*if (typeof(geoChoice) !='undefined' && geoChoice >= 0) {
           loaded=true;
        }*/
        if (typeof (accounts) != 'undefined' && accounts[0]) {
            loaded = true;
            explorerBtn.disabled = 'disabled';
            //alert("yeah" + accounts[0]);
        }
        if (loaded) {
            characterSelection.style.display=''; // none as overlay on explorer / wallet buttons
            setTimeout(()=>{characterSelection.style.opacity = 100;},100);
            overlay.style.display='none';
            //container.style.opacity = 0;
        }
        if(typeof(geoChoice) != 'undefined' && geoChoice >= 0){
            container.style.opacity = 0;
            setTimeout(()=>{characterSelection.style.display='none'},100);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.5) {
            createFruit();
        }

        for (let i = 0; i < fruits.length; i++) {
            if (fruits[i].y + fruits[i].radius < 0) {
                fruits.splice(i, 1);
            }
        }

        for (let i = 0; i < fruits.length; i++) {
            fruits[i].update();
        }

        requestAnimationFrame(gameLoop);

    }

    for (i = 0; i < 10; i++) {
        createFruit();
    }

    gameLoop();

    var cards = document.querySelectorAll(".card");
  
    cards.forEach((card) => {
        card.addEventListener("touchstart", cardSelected);
        card.addEventListener("mouseclick", cardSelected);
        //card.addEventListener("mouseout", stopAnimateCard);
        //card.addEventListener("touchend", stopAnimateCard);
        //card.addEventListener("touchcancel", stopAnimateCard);
    });
    function cardSelected(e) {
        var cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            if (card === e.target) {
                card.classList.remove("animated");
                card.classList.add("active");
                currentChoice = card.getAttribute("choice");

            } else {
                card.classList.remove("active");
                x = setTimeout(function () {
                    card.classList.add("animated");
                }, 2500);
            }
        });


        //alert(currentChoice);
    }
    function stopAnimateCard(e) {
        // remove css, apply custom animation on end
        var card = e.target;
        if (!card.classList.contains("active")) {
            card.classList.remove("animated");
            x = setTimeout(function () {
                card.classList.add("animated");
            }, 2500);
        }
    }
}