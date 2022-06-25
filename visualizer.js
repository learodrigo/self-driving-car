class Visualizer {
  static drawNetwork(_ctx, _network) {
    const margin = 50
    const left = margin
    const top = margin
    const width = _ctx.canvas.width - margin * 2
    const height = _ctx.canvas.height - margin * 2

    const levelHeight = height / _network.levels.length

    for (let i = _network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          _network.levels.length == 1 ? 0.5 : i / (_network.levels.length - 1)
        )

      _ctx.setLineDash([7, 3])
      Visualizer.drawLevel(
        _ctx,
        _network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == _network.levels.length - 1 ? ["↥", "↤", "↦", "↧"] : []
      )
    }
  }

  static drawLevel(_ctx, _level, _left, _top, _width, _height, _outputLabels) {
    const right = _left + _width
    const bottom = _top + _height

    const { inputs, outputs, weights, biases } = _level

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        _ctx.beginPath()
        _ctx.moveTo(Visualizer.#getNodeX(inputs, i, _left, right), bottom)
        _ctx.lineTo(Visualizer.#getNodeX(outputs, j, _left, right), _top)
        _ctx.lineWidth = 2
        _ctx.strokeStyle = getRGBA(weights[i][j])
        _ctx.stroke()
      }
    }

    const nodeRadius = 18
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, _left, right)
      _ctx.beginPath()
      _ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2)
      _ctx.fillStyle = "black"
      _ctx.fill()
      _ctx.beginPath()
      _ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2)
      _ctx.fillStyle = getRGBA(inputs[i])
      _ctx.fill()
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, _left, right)
      _ctx.beginPath()
      _ctx.arc(x, _top, nodeRadius, 0, Math.PI * 2)
      _ctx.fillStyle = "black"
      _ctx.fill()
      _ctx.beginPath()
      _ctx.arc(x, _top, nodeRadius * 0.6, 0, Math.PI * 2)
      _ctx.fillStyle = getRGBA(outputs[i])
      _ctx.fill()

      _ctx.beginPath()
      _ctx.lineWidth = 2
      _ctx.arc(x, _top, nodeRadius * 0.8, 0, Math.PI * 2)
      _ctx.strokeStyle = getRGBA(biases[i])
      _ctx.setLineDash([3, 3])
      _ctx.stroke()
      _ctx.setLineDash([])

      if (_outputLabels[i]) {
        _ctx.beginPath()
        _ctx.textAlign = "center"
        _ctx.textBaseline = "middle"
        _ctx.fillStyle = "black"
        _ctx.strokeStyle = "white"
        _ctx.font = nodeRadius * 1.5 + "px Arial"
        _ctx.fillText(_outputLabels[i], x, _top + nodeRadius * 0.1)
        _ctx.lineWidth = 0.5
        _ctx.strokeText(_outputLabels[i], x, _top + nodeRadius * 0.1)
      }
    }
  }

  static #getNodeX(nodes, index, _left, right) {
    return lerp(
      _left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    )
  }
}
