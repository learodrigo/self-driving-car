class Car {
  constructor(_x, _y, _w, _h, _controlType, _maxSpeed = 3) {
    this.x = _x
    this.y = _y
    this.width = _w
    this.height = _h

    this.speed = 0
    this.acc = 0.2
    this.maxSpeed = _maxSpeed
    this.friction = 0.05
    this.angle = 0
    this.damaged = false

    this.polygon = []

    this.useBrain = _controlType === "AI"

    if (_controlType !== "DUMMY") {
      this.sensor = new Sensor(this)
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4])
    }

    this.controls = new Controls(_controlType)
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acc
    }

    if (this.controls.reverse) {
      this.speed -= this.acc
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2
    }

    if (this.speed > 0) {
      this.speed -= this.friction
    }

    if (this.speed < 0) {
      this.speed += this.friction
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1

      if (this.controls.left) {
        this.angle += 0.03 * flip
      }

      if (this.controls.right) {
        this.angle -= 0.03 * flip
      }
    }

    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }

  #createPolygon() {
    const points = []

    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    })

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    })

    return points
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polygonIntersect(this.polygon, roadBorders[i])) {
        return true
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polygonIntersect(this.polygon, traffic[i].polygon)) {
        return true
      }
    }

    return false
  }

  update(roadBorders, traffic = []) {
    if (!this.damaged) {
      this.#move()
      this.polygon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBorders, traffic)
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic)

      if (this.useBrain) {
        const offsets = this.sensor.readings.map((sensor) =>
          sensor === null ? 0 : 1 - sensor.offset
        )

        const outputs = NeuralNetwork.feedForward(offsets, this.brain)

        this.controls.forward = outputs[0]
        this.controls.left = outputs[1]
        this.controls.right = outputs[2]
        this.controls.reverse = outputs[3]
      }
    }
  }

  draw(ctx, color = "black", showSensors = false) {
    ctx.fillStyle = this.damaged ? "gray" : color

    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }

    ctx.fill()

    if (this.sensor && showSensors) {
      this.sensor.draw(ctx)
    }
  }
}
