/**
 * Circle Helper
 *
 * @link https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
 */
module.exports = (function () {

	return {
        drawCircle: function (spawn, radius) {
            let positions = [];
            let x0 = spawn.pos.x;
            let y0 = spawn.pos.y;

            var x = radius-1;
            var y = 0;
            var dx = 1;
            var dy = 1;
            var diameter = radius * 2;
            var decisionOver2 = dx - diameter;

            while (x >= y) {
                // SE
                positions.push({x: x + x0, y: y + y0});
                positions.push({x: y + x0, y: x + y0});

                // SW
                positions.push({x: -x + x0, y: y + y0});
                positions.push({x: -y + x0, y: x + y0});

                // NW
                positions.push({x: -x + x0, y: -y + y0});
                positions.push({x: -y + x0, y: -x + y0});

                // NE
                positions.push({x: x + x0, y: -y + y0});
                positions.push({x: y + x0, y: -x + y0});

                if (decisionOver2 <= 0) {
                    y += 3;
                    decisionOver2 += dy;
                    dy += 2;
                }

                if (decisionOver2 > 0) {
                    x -= 3;
                    dx += 2;
                    decisionOver2 += (-diameter) + dx;
                }
            }

            // _.VERSION = 3.10.1
            // Change to _.uniqBy in 4.0.0+
            return _.uniq(positions, function(elem) {
                return [elem.x, elem.y].join(",");
            });
        }
    };
})();
