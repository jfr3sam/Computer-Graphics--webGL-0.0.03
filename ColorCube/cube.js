/*

Esam Jaafar
201751810
Assignment03 Q1

*/

let canvas
let gl

let NumVertices = 36

let points = []
let colors = []

let xAxis = 0
let yAxis = 1
let zAxis = 2

let axis = 0
let theta = [0, 0, 0]

let thetaLoc
let texCoordsArray = []

window.onload = function init() {
  canvas = document.getElementById('gl-canvas')

  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert("WebGL isn't available")
  }

  colorCube()

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  gl.enable(gl.DEPTH_TEST)

  //
  //  Load shaders and initialize attribute buffers
  //
  var shaderProgram = initShaders(gl, 'vertex-shader', 'fragment-shader')
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  }

  gl.useProgram(programInfo.program)
  {
    var texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texCoordsArray),
      gl.STATIC_DRAW
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
  }

  var cBuffer = gl.createBuffer()
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

  thetaLoc = gl.getUniformLocation(program, 'theta')

  //event listeners for buttons

  document.getElementById('xButton').onclick = function () {
    axis = xAxis
  }
  document.getElementById('yButton').onclick = function () {
    axis = yAxis
  }
  document.getElementById('zButton').onclick = function () {
    axis = zAxis
  }
  {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, earth_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, flowers_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 1)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, frogs_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 2)

    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D, jupiter_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 3)

    gl.activeTexture(gl.TEXTURE4)
    gl.bindTexture(gl.TEXTURE_2D, lightning_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 4)

    gl.activeTexture(gl.TEXTURE5)
    gl.bindTexture(gl.TEXTURE_2D, stars_t)
    gl.uniform1i(programInfo.uniformLocations.uSampler, 5)
  }

  render()
}

function loadImage(url) {
  return new Promise((res, rej) => {
    const image = new Image()
    image.src = url
    image.onload = () => res(image)
    image.onerror = rej
  })
}

function loadTexture(url) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set up temporary pixel
  const level = 0,
    internalFormat = gl.RGBA,
    width = 1,
    height = 1,
    border = 0,
    srcFormat = gl.RGBA,
    srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255])
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  )

  loadImage(url).then((image) => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    )

    // Check if the image is a power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  })

  return texture
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0
}

function colorCube() {
  const earth_t = loadTexture(gl, 'earth.jpg')
  const flowers_t = loadTexture(gl, 'flowers.jpg')
  const frogs_t = loadTexture(gl, 'frogs.jpg')
  const jupiter_t = loadTexture(gl, 'jupiter.jpg')
  const lightning_t = loadTexture(gl, 'lightning.jpg')
  const stars_t = loadTexture(gl, 'stars.jpg')

  var image_textures = [
    earth_t,
    flowers_t,
    frogs_t,
    jupiter_t,
    lightning_t,
    stars_t,
  ]
  let current_texture = earth_t
  quad(1, 0, 3, 2, current_texture)
  current_texture = flowers_t
  quad(2, 3, 7, 6, current_texture)
  current_texture = frogs_t
  quad(3, 0, 4, 7, current_texture)
  current_texture = jupiter_t
  quad(6, 5, 1, 2, current_texture)
  current_texture = lightning_t
  quad(4, 5, 6, 7, current_texture)
  current_texture = stars_t
  quad(5, 4, 0, 1, current_texture)
}

function quad(a, b, c, d, texture) {
  var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5),
  ]

  // Texture coordinates for each vertex
  const texCoords = [
    vec2(0, 0), // Corresponds to vertex a
    vec2(0, 1), // Corresponds to vertex b
    vec2(1, 1), // Corresponds to vertex c
    vec2(1, 0), // Corresponds to vertex d
  ]

  var indices = [a, b, c, a, c, d]

  for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]])
    // Assuming there's a separate array for texture coordinates
    texCoordsArray.push(texCoords[indices[i]])
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  theta[axis] += 2.0
  gl.uniform3fv(thetaLoc, theta)

  gl.drawArrays(gl.TRIANGLES, 0, NumVertices)

  requestAnimFrame(render)
}
