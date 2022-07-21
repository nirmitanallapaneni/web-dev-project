let coordianates = []
let intervals = [-1, -1, -1, -1, -1]

let sizes = [5, 5, 5, 5, 5];
let flows = ['increase', 'increase', 'increase', 'increase', 'increase']
let shapes = ['triangle', 'square', 'rectangle', 'oval', 'circle']

game_started = false;

let start_message = "(Click on start game to start the game.)"
let stop_message = "(Click on stop game to stop the game.)"
let game_guide =
    "<p>Please click anywhere on the draw region (black box) to see the shape tranformation magic.</p>" +
    "<p>(You can select upto 5 different coordinates)</p>" +
    "<p>Coordinates list is given below.</p>"

let coordinates_list = "";

function updateCoordinateList(x, y) {
    coordinates_list += `<li>x: ${x}, y: ${y}</li>`
    document.getElementById("coordinate-list").innerHTML = coordinates_list;
}

function updateSize(i) {
    switch (flows[i]) {
        case 'increase':
            sizes[i] += 5;
            if(sizes[i] > 50) flows[i] = 'decrease';
            break;
        case 'decrease':
            sizes[i] -= 5;
            if (sizes[i] < 5) {
                flows[i] = 'increase';
                sizes[i] += 5;
            }
            break;
    }
}

function clearAllIntervals() {
    intervals.forEach((interval, i) => {
        if (interval != -1) {
            clearInterval(interval)
            intervals[i] = -1;
        }
    });
}

function rectangle(ctx, coordinate, i) {
    ctx.clearRect(coordinate[0] - 1, coordinate[1] - 1, 2 * sizes[i] + 2, sizes[i] + 2);
    updateSize(i);
    ctx.beginPath();
    ctx.rect(coordinate[0], coordinate[1], sizes[i], sizes[i]);
    ctx.fill();
    ctx.stroke();
}

function square(ctx, coordinate, i) {
    ctx.clearRect(coordinate[0] - 1, coordinate[1] - 1, 2 * sizes[i]+ 2, sizes[i] + 2);
    updateSize(i);
    ctx.beginPath();
    l = sizes[i];
    ctx.rect(coordinate[0], coordinate[1], l, l / 2);
    ctx.fill();
    ctx.stroke();
}

function circle(ctx, coordinate, i) {
    ctx.clearRect(coordinate[0] - sizes[i] / 2 - 1, coordinate[1] - sizes[i] / 2 - 1, 2 * sizes[i]+ 2, sizes[i] + 2);
    updateSize(i);
    ctx.beginPath();
    ctx.arc(coordinate[0], coordinate[1], sizes[i] / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function triangle(ctx, coordinate, i) {
    ctx.clearRect(coordinate[0] - sizes[i] - 1, coordinate[1] - 1, 2 * sizes[i] + 2, sizes[i] + 2);
    updateSize(i);

    let x = coordinate[0]
    let y = coordinate[1]

    let l = sizes[i] / 2
    let w = sizes[i] / 2

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - l, y + w);
    ctx.lineTo(x + l, y + w);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function oval(ctx, coordinate, i) {
    ctx.clearRect(coordinate[0] - sizes[i] / 2 - 1, coordinate[1] - sizes[i] / 2 - 1, 2 * sizes[i]+ 2, sizes[i] + 2);
    updateSize(i);

    let x = coordinate[0]
    let y = coordinate[1]
    let w = sizes[i] / 2
    let h = sizes[i] / 2
    var kappa = .5522848,
        ox = (w / 2) * kappa,
        oy = (h / 2) * kappa,
        xe = x + w,
        ye = y + h,
        xm = x + w / 2,
        ym = y + h / 2;

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.fill();
    ctx.stroke();
}

function getRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal; 
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);   
    return `#${randColor.toUpperCase()}`
}

function updateCoordinates(x, y, ctx) {
    // console.debug(coordianates.length)
    if (coordianates.length == 5) {
        alert("You have already selected 5 coordinates. Please Stop and Start a new game to select more coordinates.")
        return;
    }
    updateCoordinateList(x, y)
    let randomShape = shapes[Math.floor(Math.random() * shapes.length)]
    // let randomShape = 'circle';
    coordianates.push([x, y, randomShape]);

    // clearAllIntervals();
    updateSize();
    coordianates.forEach((coordinate, i) => {
        if (intervals[i] == -1) {
            intervals[i] = setInterval(() => {
                let color = getRandomColor();
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                switch (coordinate[2]) {
                    case 'rectangle': rectangle(ctx, coordinate, i); break;
                    case 'triangle': triangle(ctx, coordinate, i); break;
                    case 'oval': oval(ctx, coordinate, i); break;
                    case 'circle': circle(ctx, coordinate, i); break;
                    case 'square': square(ctx, coordinate, i); break;
                }
                // ctx.fillRect(coordinate[0], coordinate[1], sizes[i], sizes[i]);
            }, 200);
        }
    })
}

window.addEventListener('load', (event) => {
    // console.debug("window loaded");

    document.getElementById("message").innerHTML = start_message

    start_button = document.getElementById("start_game");
    stop_button = document.getElementById("stop_game");
    draw_region = document.getElementById("draw-region");
    ctx = draw_region.getContext('2d');

    start_button.addEventListener('click', (event) => {
        // console.debug("clicked on start button");
        document.getElementById("message").innerHTML = stop_message
        document.getElementById("game-guide").innerHTML = game_guide

        coordianates = []

        game_started = true;
    })

    stop_button.addEventListener('click', (event) => {
        // console.debug("clicked on stop button");
        document.getElementById("message").innerHTML = start_message
        document.getElementById("game-guide").innerHTML = ""

        coordianates = []
        coordinates_list = "";
        document.getElementById("coordinate-list").innerHTML = coordinates_list;
        clearAllIntervals();
        ctx.clearRect(0, 0, draw_region.width, draw_region.height);
        game_started = false;
    })

    draw_region.addEventListener('click', (event) => {
        // console.debug("processing coordinates")

        if(!game_started) return;

        let rect = draw_region.getBoundingClientRect()
        let x = (event.clientX - rect.left) / (rect.right - rect.left) * draw_region.width;
        let y = (event.clientY - rect.top) / (rect.bottom - rect.top) * draw_region.height;

        updateCoordinates(x, y, ctx);
    })
})