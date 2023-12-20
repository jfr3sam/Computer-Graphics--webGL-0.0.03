/*

Esam Jaafar
201751810
Assignment03 Q1

*/

var lightPosition2 = vec4(1.0, -1.0, 1.0, 0.0)

var materialAmbient2 = vec4(1.0, 0.0, 1.0, 1.0)
var materialDiffuse2 = vec4(1.0, 0.0, 0.8, 1.0)
var materialSpecular2 = vec4(1.0, 0.0, 0.8, 1.0)
var ambientProduct2, diffuseProduct2, specularProduct2

var canvas
var gl

var numVertices = 36

var pointsArray = []
var normalsArray = []

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
]

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0)
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0)
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0)
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0)

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0)
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0)
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0)
var materialShininess = 100.0

var ctm
var ambientProduct, diffuseProduct, specularProduct
var modelView, projection
var viewerPos
var program

var xAxis = 0
var yAxis = 1
var zAxis = 2
var axis = 0
var theta = [0, 0, 0]

var thetaLoc

var flag = true

function quad(a, b, c, d) {
  var t1 = subtract(vertices[b], vertices[a])
  var t2 = subtract(vertices[c], vertices[a])
  var normal = cross(t1, t2)
  var normal = vec3(normal)

  pointsArray.push(vertices[a])
  normalsArray.push(normal)
  pointsArray.push(vertices[b])
  normalsArray.push(normal)
  pointsArray.push(vertices[c])
  normalsArray.push(normal)
  pointsArray.push(vertices[a])
  normalsArray.push(normal)
  pointsArray.push(vertices[c])
  normalsArray.push(normal)
  pointsArray.push(vertices[d])
  normalsArray.push(normal)
}

function colorCube() {
  quad(1, 0, 3, 2)
  quad(2, 3, 7, 6)
  quad(3, 0, 4, 7)
  quad(6, 5, 1, 2)
  quad(4, 5, 6, 7)
  quad(5, 4, 0, 1)
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas')

  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert("WebGL isn't available")
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  gl.enable(gl.DEPTH_TEST)

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  colorCube()

  var nBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW)

  var vNormal = gl.getAttribLocation(program, 'vNormal')
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vNormal)

  var vBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW)

  var vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  thetaLoc = gl.getUniformLocation(program, 'theta')

  viewerPos = vec3(0.0, 0.0, -20.0)

  projection = ortho(-1, 1, -1, 1, -100, 100)

  ambientProduct = mult(lightAmbient, materialAmbient)
  diffuseProduct = mult(lightDiffuse, materialDiffuse)
  specularProduct = mult(lightSpecular, materialSpecular)
  ambientProduct2 = mult(lightAmbient, materialAmbient2)
  diffuseProduct2 = mult(lightDiffuse, materialDiffuse2)
  specularProduct2 = mult(lightSpecular, materialSpecular2)

  document.getElementById('ButtonX').onclick = function () {
    axis = xAxis
  }
  document.getElementById('ButtonY').onclick = function () {
    axis = yAxis
  }
  document.getElementById('ButtonZ').onclick = function () {
    axis = zAxis
  }
  document.getElementById('ButtonT').onclick = function () {
    flag = !flag
  }

  gl.uniform4fv(
    gl.getUniformLocation(program, 'ambientProduct'),
    flatten(ambientProduct)
  )
  gl.uniform4fv(
    gl.getUniformLocation(program, 'diffuseProduct'),
    flatten(diffuseProduct)
  )
  gl.uniform4fv(
    gl.getUniformLocation(program, 'specularProduct'),
    flatten(specularProduct)
  )
  gl.uniform4fv(
    gl.getUniformLocation(program, 'lightPosition'),
    flatten(lightPosition)
  )

  gl.uniform1f(gl.getUniformLocation(program, 'shininess'), materialShininess)

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'projectionMatrix'),
    false,
    flatten(projection)
  )

  render()
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  if (flag) theta[axis] += 2.0

  // First Cube - Scale, Rotate, Translate
  var mvMatrix1 = mat4()
  mvMatrix1 = mult(mvMatrix1, scalem(0.5, 0.5, 0.5)) // Scale by 0.5
  mvMatrix1 = mult(mvMatrix1, rotate(theta[xAxis], [1, 0, 0]))
  mvMatrix1 = mult(mvMatrix1, rotate(theta[yAxis], [0, 1, 0]))
  mvMatrix1 = mult(mvMatrix1, rotate(theta[zAxis], [0, 0, 1]))
  mvMatrix1 = mult(mvMatrix1, translate(-0.5, 0, 0)) // Translate to the left by 0.5 units
  setLightProducts(ambientProduct, diffuseProduct, specularProduct)
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'modelViewMatrix'),
    false,
    flatten(mvMatrix1)
  )
  gl.drawArrays(gl.TRIANGLES, 0, numVertices)

  // Second Cube - Scale, Translate without rotation
  var mvMatrix2 = mat4()
  mvMatrix2 = mult(mvMatrix2, scalem(0.5, 0.5, 0.5)) // Scale by 0.5
  mvMatrix2 = mult(mvMatrix2, translate(0.5, 0, 0)) // Translate to the right by 0.5 units
  setLightProducts(ambientProduct2, diffuseProduct2, specularProduct2)
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'modelViewMatrix'),
    false,
    flatten(mvMatrix2)
  )
  gl.drawArrays(gl.TRIANGLES, 0, numVertices)

  requestAnimFrame(render)
}

function setLightProducts(ambientProduct, diffuseProduct, specularProduct) {
  if (!Array.isArray(ambientProduct) || ambientProduct.length !== 4) {
    console.error('ambientProduct is not a valid array')
    return
  }
  gl.uniform4fv(
    gl.getUniformLocation(program, 'ambientProduct'),
    new Float32Array(ambientProduct)
  )
  gl.uniform4fv(
    gl.getUniformLocation(program, 'diffuseProduct'),
    new Float32Array(diffuseProduct)
  )
  gl.uniform4fv(
    gl.getUniformLocation(program, 'specularProduct'),
    new Float32Array(specularProduct)
  )
}
