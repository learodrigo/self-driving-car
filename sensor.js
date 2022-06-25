class Sensor {
  constructor(_car) {
    this.car = _car
    this.rayCount = 19
    this.rayLength = 200
    this.raySpread = Math.PI / 1.4

    this.rays = []
    this.readings = []
  }

  #castRays() {
    this.rays = []

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle

      const stratPoint = { x: this.car.x, y: this.car.y }
      const endPoint = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([stratPoint, endPoint])
    }
  }

  #getReading(ray, roadBorders, traffic) {
    const touches = []

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      )

      if (touch) {
        touches.push(touch)
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const polygon = traffic[i].polygon
      for (let j = 0; j < polygon.length; j++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          polygon[j],
          polygon[(j + 1) % polygon.length]
        )

        if (touch) {
          touches.push(touch)
        }
      }
    }

    if (touches.length === 0) {
      return null
    }

    const offsets = touches.map((touch) => touch.offset)
    const minOffset = Math.min(...offsets)
    return touches.find((touch) => touch.offset === minOffset)
  }

  update(roadBorders, traffic) {
    this.#castRays()

    this.readings = []

    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic))
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.readings[i] ? this.readings[i] : this.rays[i][1]

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = "yellow"
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = "black"
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }
}
