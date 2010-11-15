window.onload = init

var ctx
var image
var pixels
var width
var height

function getSelectionValue(boxes) {
    var selection = ""
    for(var i=0; i<boxes.length; i++ ) {
        if(boxes[i].checked) {
            selection = boxes[i].value
            break
        }
    }
    return selection
}

function redrawOnSelection() {
    var fractalSet = document.getElementById('fractal-set')
    for(var i=0; i<fractalSet.set.length; i++) {
        fractalSet.set[i].onclick = function () {
            redraw()
        }
    }
}

function init() {
    redrawOnSelection()

    redraw()
}

function redraw() {
    var fractalSet = document.getElementById('fractal-set')
    var selection = getSelectionValue(fractalSet.set)
    var specs
    if(selection == "Julia") {
        specs = new JuliaSpecs(new Coords(-1.7, 1.7, -1, 1), -0.8, 0.156, 20)
    } else {
        specs = new MandelbrotSpecs(new Coords(-2.25, 0.75, -1.5, 1.5), 20)
    }

    draw(specs)
}




function Coords(xstart, xend, ystart, yend) {
    this.xstart = xstart
    this.xend = xend
    this.ystart = ystart
    this.yend = yend

    Coords.prototype.getXStep = function() {
        return (xend - xstart)/width
    }

    Coords.prototype.getYStep = function() {
        return (yend - ystart)/height
    }
}

function JuliaSpecs(coords, cr, ci, iterations) {
    this.coords = coords
    this.cr = cr
    this.ci = ci
    this.maxIterationCount = iterations

    JuliaSpecs.prototype.getCr = function() {
        return cr
    }

    JuliaSpecs.prototype.getCi = function() {
        return ci
    }

    JuliaSpecs.prototype.getMaxIterationCount = function() {
        return this.maxIterationCount
    }

    JuliaSpecs.prototype.getRStartForStep = function(step) {
        return coords.xstart + this.coords.getXStep()*step
    }

    JuliaSpecs.prototype.getIStartForStep = function(step) {
        return coords.ystart + this.coords.getYStep()*step
    }

    JuliaSpecs.prototype.initFor = function(x, y) {
    }
}

function MandelbrotSpecs(coords, iterations) {
    this.coords = coords
    this.maxIterationCount = iterations
    this.x = 0
    this.y = 0

    MandelbrotSpecs.prototype.getCr = function() {
        return this.x
    }

    MandelbrotSpecs.prototype.getCi = function() {
        return this.y
    }

    MandelbrotSpecs.prototype.getMaxIterationCount = function() {
        return this.maxIterationCount
    }

    MandelbrotSpecs.prototype.getRStartForStep = function(step) {
        return 0
    }

    MandelbrotSpecs.prototype.getIStartForStep = function(step) {
        return 0
    }

    MandelbrotSpecs.prototype.initFor = function(x, y) {
        this.x = x
        this.y = y
    }
}

function draw(specs) {

	var canvas = document.getElementById('fractal')
	if(canvas.getContext) {
        width = canvas.width
        height = canvas.height
		ctx = canvas.getContext('2d')
        image = ctx.getImageData(0, 0, width, height)
        pixels = image.data

		var xstep = specs.coords.getXStep()
		var ystep = specs.coords.getYStep()

		var x = specs.coords.xstart
		var y = specs.coords.ystart

		for(var i=0; i<width; i++) {
			for(var j=0; j<height; j++) {
                specs.initFor(x, y)

                var color = 0
				var z = specs.getRStartForStep(i)
				var zi = specs.getIStartForStep(j)
				for(var k=0; k<specs.getMaxIterationCount(); k++) {
					var newz = (z*z) - (zi*zi) + specs.getCr()
					var newzi = 2*z*zi + specs.getCi()
					z = newz
					zi = newzi

                    var len = ((z*z) + (zi*zi))
                    if(len > 4) {
                        color = k
                        k = specs.getMaxIterationCount()
                    }
				}

                drawPixel(i, j, color, specs)
                y = y + ystep
			}
			x = x + xstep
			y = specs.coords.ystart
		}
        ctx.putImageData(image, 0, 0);
	}
}

function drawPixel(x, y, color, specs) {
    var col = Math.floor(color/specs.getMaxIterationCount() * 255)

    var offset = 4*(y*width + x)
    pixels[offset] = col
    pixels[offset+1] = col
    pixels[offset+2] = col
    pixels[offset+3] = 255
}


