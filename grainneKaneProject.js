
function levelOne() {

//array for canvas 'X' marks the placement of image //

    const ground = new Array(9).fill(new Array(9).fill('X'))

    const wall = [
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', ' ', ' ', 'X', 'X', 'X', ' ', ' ', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ]

    const goal = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]

    const box = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', 'X', ' ', ' ', 'X', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
// mark user with X in future developments//
    const user = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];

//user x and user y used for comparison testing //
    let userX = 2
    let userY = 2


    const structureImage = (structure, textureImage, canvas) => {
        const pixelWidthStructure = canvas.width / structure[0].length
        const pixelHeightStructure = canvas.height / structure.length
        const context = canvas.getContext('2d')

        structure.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 'X') {
                    context.drawImage(
                        textureImage,
                        x * pixelWidthStructure,
                        y * pixelHeightStructure,
                        pixelWidthStructure,
                        pixelHeightStructure
                    )
                }
            })
        })
    }


    const hasWon = (goal, box) => {
        for (let y = 0; y < goal.length; y++) {
            for (let x = 0; x < goal[0].length; x++) {
                if (goal[y][x] !== box[y][x]) {
                    // Some box is not aligned with a goal.
                    return false
                }
            }
        }

        return true
    }


// for the images used//
    const loadTexture = texture => new Promise(resolve => {
        const image = new Image()
        image.addEventListener('load', () => {
            resolve(image)
        })

        image.src = texture
    })

    Promise.allSettled([
        loadTexture('../FinalProject/newGround.png'),
        loadTexture('../FinalProject/brick.png'),
        loadTexture('../FinalProject/newTarget.png'),
        loadTexture('../FinalProject/newBox.png'),
        loadTexture('../FinalProject/newWorker.png'),
    ]).then(results => {
        const [
            groundTexture,
            wallTexture,
            goalTexture,
            boxTexture,
            workerTexture
        ] = results.map(result => result.value)

        const canvas = document.querySelector('#canvas')

        //to render each image//
        const render = () => {
            structureImage(ground, groundTexture, canvas)
            structureImage(wall, wallTexture, canvas)
            structureImage(goal, goalTexture, canvas)
            structureImage(box, boxTexture, canvas)
            structureImage(user, workerTexture, canvas)
        }

        render()

        //to determine user input//

        window.addEventListener('keydown', event => {
            let xMovement = 0
            let yMovement = 0

            switch (event.key) {
                case 'ArrowUp':
                    yMovement = -1
                    break
                case 'ArrowDown':
                    yMovement = 1
                    break
                case 'ArrowLeft':
                    xMovement = -1
                    break
                case 'ArrowRight':
                    xMovement = 1
                    break

                case "undo":
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'z', 'ctrlKey': true}));
                    break;
            }

//new user for comparison//
            const newUserX = userX + xMovement
            const newUserY = userY + yMovement

            // Collision with end of playing field
            if (
                newUserX < 0
                || newUserY < 0
                || newUserX > ground[0].length - 1
                || newUserY > ground.length - 1
            ) {
                return
            }

            // Wall collision
            if (wall[newUserY][newUserX] === 'X') {
                return
            }

            const newBoxX=newUserX+xMovement;
            const newBoxY=newUserY+yMovement;
            // Box collision
            if (box[newUserY][newUserX] === 'X') {
                if ((box[newBoxY][newBoxX] === 'X')||( wall[newBoxY][newBoxX] === 'X')) {
                    return
                }

                box[newUserY][newUserX] = ' '
                box[newBoxY][newBoxX] = 'X'
            }

            user[userY][userX] = ' '
            user[newUserY][newUserX] = 'X'
            userX = newUserX
            userY = newUserY

            if((goal[newBoxY][newBoxX])==='X'){
                console.log("test")
            }

            if (hasWon(goal, box)) {
                document.getElementById('final-msg').innerHTML = "Congrats! You have completed this level! </br> Please reload page before selecting next level"


            }

            render()
        })
    })}

function levelTwo() {


//array for canvas 'X' marks the placement of image //

    const ground = new Array(9).fill(new Array(9).fill('X'))

    const wall = [
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', 'X'],
        ['X', 'X', 'X', 'X', 'X', ' ', ' ', ' ', 'X'],
        ['X', 'X', 'X', 'X', 'X', ' ', ' ', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', ' ', ' ', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', ' ', ' ', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ]

    const goal = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]

    const box = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', 'X', 'X', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]

    const user = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];

//user x and user y used for comparison testing //
    let userX = 2
    let userY = 2



    const structureImage = (structure, textureImage, canvas) => {
        const pixelWidthStructure = canvas.width / structure[0].length
        const pixelHeightStructure = canvas.height / structure.length
        const context = canvas.getContext('2d')

        structure.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 'X') {
                    context.drawImage(
                        textureImage,
                        x * pixelWidthStructure,
                        y * pixelHeightStructure,
                        pixelWidthStructure,
                        pixelHeightStructure
                    )
                }
            })
        })
    }


    const hasWon = (goal, box) => {
        for (let y = 0; y < goal.length; y++) {
            for (let x = 0; x < goal[0].length; x++) {
                if (goal[y][x] !== box[y][x]) {
                    // Some box is not aligned with a goal.
                    return false
                }
            }
        }

        return true
    }


// for the images used//
    const loadTexture = texture => new Promise(resolve => {
        const image = new Image()
        image.addEventListener('load', () => {
            resolve(image)
        })

        image.src = texture
    })

    Promise.allSettled([
        loadTexture('../FinalProject/newGround.png'),
        loadTexture('../FinalProject/brick.png'),
        loadTexture('../FinalProject/newTarget.png'),
        loadTexture('../FinalProject/newBox.png'),
        loadTexture('../FinalProject/newWorker.png'),
    ]).then(results => {
        const [
            groundTexture,
            wallTexture,
            goalTexture,
            boxTexture,
            workerTexture
        ] = results.map(result => result.value)

        const canvas = document.querySelector('#canvas')

        //to render each image//
        const render = () => {
            structureImage(ground, groundTexture, canvas)
            structureImage(wall, wallTexture, canvas)
            structureImage(goal, goalTexture, canvas)
            structureImage(box, boxTexture, canvas)
            structureImage(user, workerTexture, canvas)
        }

        render()

        //to determine user input//

        window.addEventListener('keydown', event => {
            let xMovement = 0
            let yMovement = 0

            switch (event.key) {
                case 'ArrowUp':
                    yMovement = -1
                    break
                case 'ArrowDown':
                    yMovement = 1
                    break
                case 'ArrowLeft':
                    xMovement = -1
                    break
                case 'ArrowRight':
                    xMovement = 1
                    break
            }
//new user for comparison//
            const newUserX = userX + xMovement
            const newUserY = userY + yMovement

            // Collision with end of playing field
            if (
                newUserX < 0
                || newUserY < 0
                || newUserX > ground[0].length - 1
                || newUserY > ground.length - 1
            ) {
                return
            }

            // Wall collision
            if (wall[newUserY][newUserX] === 'X') {
                return
            }

            const newBoxX=newUserX+xMovement;
            const newBoxY=newUserY+yMovement;
            // Box collision
            if (box[newUserY][newUserX] === 'X') {
                if ((box[newBoxY][newBoxX] === 'X')||( wall[newBoxY][newBoxX] === 'X')) {
                    return
                }

                box[newUserY][newUserX] = ' '
                box[newBoxY][newBoxX] = 'X'
            }

            user[userY][userX] = ' '
            user[newUserY][newUserX] = 'X'
            userX = newUserX
            userY = newUserY

            if((goal[newBoxY][newBoxX])==='X'){
                console.log("test")
            }

            if (hasWon(goal, box)) {
                document.getElementById('final-msg').innerHTML = "Congrats! You have completed this level! </br>Please reload page before selecting next level"
            }

            render()
        })
    })}

function levelThree() {

//array for canvas 'X' marks the placement of image //

    const ground = new Array(9).fill(new Array(9).fill('X'))

    const wall = [
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X'],
        ['X', 'X', ' ', ' ', 'X', ' ', ' ', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X'],
        ['X', 'X', ' ', ' ', ' ', ' ', ' ', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ]

    const goal = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'X', 'X', 'X', 'X', 'X', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]

    const box = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'X', 'X', 'X', 'X', 'X', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ]
//mark user with X in future developments//
    const user = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ];

//user x and user y used for comparison testing //
    let userX = 2
    let userY = 2


    const structureImage = (structure, textureImage, canvas) => {
        const pixelWidthStructure = canvas.width / structure[0].length
        const pixelHeightStructure = canvas.height / structure.length
        const context = canvas.getContext('2d')

        structure.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 'X') {
                    context.drawImage(
                        textureImage,
                        x * pixelWidthStructure,
                        y * pixelHeightStructure,
                        pixelWidthStructure,
                        pixelHeightStructure
                    )
                }
            })
        })
    }

    const hasWon = (goal, box) => {
        for (let y = 0; y < goal.length; y++) {
            for (let x = 0; x < goal[0].length; x++) {
                if (goal[y][x] !== box[y][x]) {
                    // Some box is not aligned with a goal.
                    return false
                }
            }
        }

        return true
    }


// for the images used//
    const loadTexture = texture => new Promise(resolve => {
        const image = new Image()
        image.addEventListener('load', () => {
            resolve(image)
        })

        image.src = texture
    })

    Promise.allSettled([
        loadTexture('../FinalProject/newGround.png'),
        loadTexture('../FinalProject/brick.png'),
        loadTexture('../FinalProject/newTarget.png'),
        loadTexture('../FinalProject/newBox.png'),
        loadTexture('../FinalProject/newWorker.png'),
    ]).then(results => {
        const [
            groundTexture,
            wallTexture,
            goalTexture,
            boxTexture,
            workerTexture
        ] = results.map(result => result.value)

        const canvas = document.querySelector('#canvas')

        //to render each image//
        const render = () => {
            structureImage(ground, groundTexture, canvas)
            structureImage(wall, wallTexture, canvas)
            structureImage(goal, goalTexture, canvas)
            structureImage(box, boxTexture, canvas)
            structureImage(user, workerTexture, canvas)
        }

        render()

        //to determine user input//

        window.addEventListener('keydown', event => {
            let xMovement = 0
            let yMovement = 0

            switch (event.key) {
                case 'ArrowUp':
                    yMovement = -1
                    break
                case 'ArrowDown':
                    yMovement = 1
                    break
                case 'ArrowLeft':
                    xMovement = -1
                    break
                case 'ArrowRight':
                    xMovement = 1
                    break
            }
//new user for comparison//
            const newUserX = userX + xMovement
            const newUserY = userY + yMovement

            // Collision with end of playing field
            if (
                newUserX < 0
                || newUserY < 0
                || newUserX > ground[0].length - 1
                || newUserY > ground.length - 1
            ) {
                return
            }

            // Wall collision
            if (wall[newUserY][newUserX] === 'X') {
                return
            }

            const newBoxX=newUserX+xMovement;
            const newBoxY=newUserY+yMovement;
            // Box collision
            if (box[newUserY][newUserX] === 'X') {
                if ((box[newBoxY][newBoxX] === 'X')||( wall[newBoxY][newBoxX] === 'X')) {
                    return
                }

                box[newUserY][newUserX] = ' '
                box[newBoxY][newBoxX] = 'X'
            }

            user[userY][userX] = ' '
            user[newUserY][newUserX] = 'X'
            userX = newUserX
            userY = newUserY

            if((goal[newBoxY][newBoxX])==='X'){
                console.log("test")
            }

            if (hasWon(goal, box)) {
                document.getElementById('final-msg').innerHTML = "Congrats! You have completed this level!</br>Please reload page before selecting next level"
            }

            render()
        })
    })}

/*
case "undo"
document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'z', 'ctrlKey': true})); */

