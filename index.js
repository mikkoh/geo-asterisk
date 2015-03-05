module.exports = geoAsterisk;

function geoAsterisk(options) {

  var geo = {

    positions: [],
    cells: []
  };

  options = options || {};
  options.cellSize = options.cellSize || 3;
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.z = options.z || 0;
  options.startRadian = options.startRadian || 0;
  options.innerRadius = options.innerRadius || 50;
  options.outerRadius = options.outerRadius || 140;
  options.numSlices = options.numSlices || 10;

  createGeometry( options, geo.positions, geo.cells );

  return geo;
}

function createGeometry( o, positions, cells) {

  var radInc = Math.PI * 2 / o.numSlices;
  var radIncHalf = radInc * 0.5;
  var radiusDif = o.outerRadius - o.innerRadius;
  var startRad, midRad, endRad, startInnerX, startInnerZ, endInnerX, endInnerZ, i4;

  // if the cellsize is 3 we need to add the center dot
  if( o.cellSize == 3 ) {

    positions.push([o.x, o.y, o.z]);
  }

  for(var i = 0; i < o.numSlices; i++) {

    startRad = o.startRadian + radInc * i;
    midRad = startRad + radIncHalf;
    endRad = startRad + radInc;

    // inner
    positions.push([ 
      startInnerX = Math.cos( startRad ) *  o.innerRadius + o.x,
      o.y,
      startInnerZ = Math.sin( startRad ) *  o.innerRadius + o.z
    ]);

    positions.push([ 
      endInnerX = Math.cos( endRad ) *  o.innerRadius + o.x,
      o.y,
      endInnerZ = Math.sin( endRad ) *  o.innerRadius + o.z
    ]);

    // outer
    positions.push([ 
      startInnerX + Math.cos( midRad ) * radiusDif,
      o.y,
      startInnerZ + Math.sin( midRad ) * radiusDif
    ]);

    positions.push([ 
      endInnerX + Math.cos( midRad ) * radiusDif,
      o.y,
      endInnerZ + Math.sin( midRad ) * radiusDif
    ]);

    i4 = i * 4;

    if( o.cellSize == 1 ) {

      cells.push([ i4 ], [ i4 + 1 ], [ i4 + 2 ], [ i4 + 3 ]); 
    } else if( o.cellSize == 2 ) {

      cells.push(
        [ i4, i4 + 2 ], 
        [ i4 + 2, i4 + 3 ],
        [ i4 + 3, i4 + 1 ]
      ); 
    } else if( o.cellSize == 3 ) {

      // +1 because of the center dot
      i4 += 1;

      // outside triangles
      cells.push(
        [ i4, i4 + 2, i4 + 1 ],
        [ i4 + 2, i4 + 3, i4 + 1 ]
      );

      // triangle going to center
      cells.push(
        [ 0, i4, i4 + 1 ]
      );      
    }
  }
}