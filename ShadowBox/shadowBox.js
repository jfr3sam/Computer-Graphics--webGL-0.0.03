/*

Esam Jaafar
201751810
Assignment03 Q1

*/

var canvas
var gl

var cBuffer
var modelView, projection
var mvMatrix = mat4()
var pMatrix

var points = []
var colors = []
var shadowColors = []
var vertices = [
  vec3(-50, -50, 50),
  vec3(-50, 50, 50),
  vec3(50, 50, 50),
  vec3(50, -50, 50),
  vec3(-50, -50, -50),
  vec3(-50, 50, -50),
  vec3(50, 50, -50),
  vec3(50, -50, -50),

  vec3(-150, -150, 150),
  vec3(-150, 150, 150),
  vec3(150, 150, 150),
  vec3(150, -150, 150),
]

var vertexColors = [
  [1.0, 0.0, 0.0, 1.0], // red
  [0.0, 0.0, 1.0, 1.0], // blue
  [0.0, 1.0, 0.0, 1.0], // green
  [1.0, 1.0, 0.0, 1.0], // yellow
  [0.0, 1.0, 1.0, 1.0], // cyan
  [1.0, 0.0, 1.0, 1.0], // magenta
  [0.5, 0.5, 0.5, 1.0], // grey
  [0.5, 0.5, 0.5, 1.0], // grey
]

var xAxis = 0
var yAxis = 1
var zAxis = 2
var axis = 0
var theta = [0, 0, 0]

var lightSource = vec3(0.0, 250.0, -50.0)
var m

function createProjectionMatrix() {
  var yl = lightSource[1]
  m = mat4(
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    -1.0 / yl,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0
  )
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas')
  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert("WebGL isn't available")
  }

  drawBox()

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  cBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)

  var vColor = gl.getAttribLocation(program, 'vColor')
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vColor)

  var vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

  var vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  modelView = gl.getUniformLocation(program, 'modelView')
  projection = gl.getUniformLocation(program, 'projection')
  pMatrix = ortho(-250, 250, -250, 250, -250, 250) //ortho(90, 0, 0, 0, 0, 0);
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix))

  createProjectionMatrix()

  window.onkeydown = keyResponse

  render()
}

function keyResponse(event) {
  var key = String.fromCharCode(event.keyCode)
  switch (key) {
    case '1':
      axis = xAxis
      theta[axis] += 2.0
      break
    case '2':
      axis = xAxis
      theta[axis] -= 2.0
      break
    case '3':
      axis = yAxis
      theta[axis] += 2.0
      break
    case '4':
      axis = yAxis
      theta[axis] -= 2.0
      break
    case '5':
      axis = zAxis
      theta[axis] += 2.0
      break
    case '6':
      axis = zAxis
      theta[axis] -= 2.0
      break
  }
}

function drawBox() {
  quad(1, 0, 3, 2, vertexColors[0])
  quad(2, 3, 7, 6, vertexColors[1])
  quad(4, 5, 6, 7, vertexColors[2])
  quad(5, 4, 0, 1, vertexColors[3])
  quad(1, 2, 6, 5, vertexColors[4])
  quad(0, 4, 7, 3, vertexColors[5])
  quad(8, 9, 10, 11, vertexColors[6])
}

function quad(a, b, c, d, color) {
  var indices = [a, b, c, a, c, d]
  for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]])
    colors.push(color)
    shadowColors.push(vec4(0.3, 0.3, 0.3, 1.0))
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Draw the box
  mvMatrix = mat4()
  mvMatrix = mult(mvMatrix, rotate(theta[xAxis], vec3(1, 0, 0)))
  mvMatrix = mult(mvMatrix, rotate(theta[yAxis], vec3(0, 1, 0)))
  mvMatrix = mult(mvMatrix, rotate(theta[zAxis], vec3(0, 0, 1)))
  mvMatrix = mult(mvMatrix, translate(0.0, 100.0, 0.0))
  mvMatrix = mult(mvMatrix, rotate(30.0, vec3(1, 0, 0)))
  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix))
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, points.length)

  // // Draw the shadow
  // mvMatrix = mat4();
  // mvMatrix = mult(mvMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
  // mvMatrix = mult(mvMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
  // mvMatrix = mult(mvMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));
  // mvMatrix = mult(mvMatrix, translate(0.0, 100.0, 0.0));
  // mvMatrix = mult(mvMatrix, translate(-lightSource[0], -lightSource[1], -lightSource[2]));
  // mvMatrix = mult(mvMatrix, m);
  // mvMatrix = mult(mvMatrix, translate(lightSource[0], lightSource[1], lightSource[2]));
  // mvMatrix = mult(mvMatrix, rotate(30.0, vec3(1, 0, 0)));
  // gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, flatten(shadowColors), gl.STATIC_DRAW);
  // gl.drawArrays(gl.TRIANGLES, 0, points.length);

  requestAnimFrame(render)
}
