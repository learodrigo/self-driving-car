const carCanvas = document.getElementById("carCanvas")
const networkCanvas = document.getElementById("networkCanvas")

carCanvas.width = 200
networkCanvas.width = 500

const carCtx = carCanvas.getContext("2d")
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 100
const cars = generateCars(N)
let bestCar = cars[0]

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2)
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
]

const save = () => {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

const animate = (time) => {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders)
  }

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i]
    car.update(road.borders, traffic)
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.85)

  road.draw(carCtx)

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "green")
  }

  carCtx.globalAlpha = 0.2

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i]
    car.draw(carCtx, "blue")
  }

  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, "blue", true)

  carCtx.restore()

  networkCtx.lineDashOffset = -time / 75
  Visualizer.drawNetwork(networkCtx, bestCar.brain)

  requestAnimationFrame(animate)
}

animate()
