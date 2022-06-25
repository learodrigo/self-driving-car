const lerp = (a, b, t) => a + (b - a) * t

const getIntersection = (objStart, objEnd, targetStart, targetEnd) => {
  const tTop =
    (targetEnd.x - targetStart.x) * (objStart.y - targetStart.y) -
    (targetEnd.y - targetStart.y) * (objStart.x - targetStart.x)

  const uTop =
    (targetStart.y - objStart.y) * (objStart.x - objEnd.x) -
    (targetStart.x - objStart.x) * (objStart.y - objEnd.y)

  const bottom =
    (targetEnd.y - targetStart.y) * (objEnd.x - objStart.x) -
    (targetEnd.x - targetStart.x) * (objEnd.y - objStart.y)

  if (bottom === 0) {
    return null
  }

  const t = tTop / bottom
  const u = uTop / bottom

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: lerp(objStart.x, objEnd.x, t),
      y: lerp(objStart.y, objEnd.y, t),
      offset: t,
    }
  }
}

const polygonIntersect = (polygonOne, polygonTwo) => {
  for (let i = 0; i < polygonOne.length; i++) {
    for (let j = 0; j < polygonTwo.length; j++) {
      const touch = getIntersection(
        polygonOne[i],
        polygonOne[(i + 1) % polygonOne.length],
        polygonTwo[j],
        polygonTwo[(j + 1) % polygonTwo.length]
      )

      if (touch) {
        return true
      }
    }
  }

  return false
}

const getRGBA = (value) => {
  const alpha = Math.abs(value)
  const R = value < 0 ? 0 : 255
  const G = R
  const B = value > 0 ? 0 : 255
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")"
}

const generateCars = (n) => {
  const cars = []

  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
  }

  return cars
}

const getRandomColor = () => {
  const hue = 290 + Math.random() * 260
  return "hsl(" + hue + ", 100%, 60%)"
}

const discard = () => {
  localStorage.removeItem("bestBrain")
}
