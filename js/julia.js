window.onload = draw

var iter = 20
var ctx
var image
var pixels
var width
var height

function draw() {
	var canvas = document.getElementById('mandelbrot')
	if(canvas.getContext) {
        width = canvas.width
        height = canvas.height
		ctx = canvas.getContext('2d')
        image = ctx.getImageData(0, 0, width, height)
        pixels = image.data

		var xstart = -1.7
		var xend = 1.7
		var ystart = -1
		var yend = 1

		var xstep = (xend - xstart)/width
		var ystep = (yend - ystart)/height

		var x = xstart
		var y = ystart

		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
                var color = 0
				var z = xstart + xstep*i
				var zi = ystart + ystep*j
				for(var k=0; k<iter; k++) {
					var newz = (z*z) - (zi*zi) - 0.8
					var newzi = 2*z*zi + 0.156
					z = newz
					zi = newzi

                    var len = ((z*z) + (zi*zi))
                    if(len > 100000) {
                        color = k
                        k = iter
                    }
				}

                drawPixel(i, j, color)
                y = y + ystep
			}
			x = x + xstep
			y = ystart
		}
        ctx.putImageData(image, 0, 0);
	}
}

function drawPixel(x, y, color) {
    var col = Math.floor(color/iter * 255)

    var offset = 4*(y*width + x)
    pixels[offset] = col
    pixels[offset+1] = col
    pixels[offset+2] = col
    pixels[offset+3] = 255
}


