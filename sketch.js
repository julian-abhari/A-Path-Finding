var columns = 25;
var rows = 25;
var grid = new Array(columns);

var openSet = [];
var closedSet = [];
var startingCell;
var endingCell;
var cellWidth, cellHeight;
var path = [];

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
	this.wall = false;

	if (random(1) < 0.1) {
		this.wall = true;
	}

  this.show = function(color) {
		if (!this.wall) {
			fill(color);
		} else {
			fill(0);
		}
    noStroke();
    rect(this.i * cellWidth, this.j * cellHeight, cellWidth - 1, cellHeight - 1);
  }

  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if (i < columns - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
  }
}

function removeFromArray(array, element) {
  for (var i = array.length - 1; i >= 0; i -= 1) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //frameRate(1);
  cellWidth = width / columns;
  cellHeight = height / rows;

  for (var i = 0; i < columns; i += 1) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < columns; i += 1) {
    for (var j = 0; j < rows; j += 1) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < columns; i += 1) {
    for (var j = 0; j < rows; j += 1) {
      grid[i][j].addNeighbors(grid);
    }
  }

  startingCell = grid[0][0];
  endingCell = grid[columns - 1][rows - 1];
	startingCell.wall = false;
	endingCell.wall = false;
  openSet.push(startingCell);
}

function draw() {
  background(0);

  if (openSet.length > 0) {
    var lowestIndex = 0;
    for (var i = 0; i < openSet.length; i += 1) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    var currentCell = openSet[lowestIndex];

    if (currentCell === endingCell) {
      console.log("DONE");
      // Find the Path
      path = [];
      var tempCell = currentCell;
      path.push(tempCell);
      while (tempCell.previous) {
        path.push(tempCell.previous);
        tempCell = tempCell.previous;
      }
      noLoop();
    }

    removeFromArray(openSet, currentCell);
    closedSet.push(currentCell);

    var neighbors = currentCell.neighbors;
    for (var i = 0; i < neighbors.length; i += 1) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = currentCell.g + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          openSet.push(neighbor);
        }
        neighbor.h = heuristic(neighbor, endingCell);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = currentCell;
      }
    }
  } else {
		console.log("no solution");
		noLoop();
	}

  for (var i = 0; i < columns; i += 1) {
    for (var j = 0; j < rows; j += 1) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; i += 1) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i += 1) {
    openSet[i].show(color(0, 255, 0));
  }

  for (var i = 0; i < path.length; i += 1) {
    path[i].show(color(0, 0, 255));
  }
}

function heuristic(a, b) {
  var distance = dist(a.i, a.j, b.i, b.j);
	//var distance = abs(a.i - b.i) + abs(a.j - b.j);
  return distance;
}
