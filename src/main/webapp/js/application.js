(function($)
{

    $(document).ready(function()
    {
		$(document).bind("mousemove",makeStroke);
		uID = generateID();
		initCanvas();

        // Idempotent function called every time the connection
        // with the Bayeux server is (re-)established
        var _subscription;
        function _connectionSucceeded()
        {
            //$('#body').empty().append('<div>Cometd Connection Succeeded</div>');

            cometd.batch(function()
            {
                if (_subscription)
                {
                    cometd.unsubscribe(_subscription);
                }
                _subscription = cometd.subscribe('/drawing', function(message)
                {

                    updateCanvas(message.data.position);
                    if(message.data.masterColor != undefined) {
	                    yourColor = message.data.masterColor;
	                }
					
                    
                });

                cometd.publish('/drawing', { joinUp: uID + " has joined" });

            });
        }
        
        function _connectionBroken()
        {
            //$('#body').empty().html('Cometd Connection Broken');
        }

        // Function that manages the connection status with the Bayeux server
        var _connected = false;
        function _metaConnect(message)
        {
            var wasConnected = _connected;
            _connected = message.successful === true;
            if (!wasConnected && _connected)
            {
                _connectionSucceeded();
            }
            else if (wasConnected && !_connected)
            {
                _connectionBroken();
            }
        }

        // Disconnect when the page unloads
        $(window).unload(function()
        {
            cometd.disconnect();
        });

        var cometURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
        cometd.configure({
            url: cometURL,
            logLevel: 'debug'
        });

        cometd.addListener('/meta/connect', _metaConnect);

        cometd.handshake();
    });

	var makeStroke = function(e) {
		if(isDrawing == true) {
		// lord jesus help me here...
	// this function does a few things:
	// 	1. draws stroke to the screen
	// 	2. saves the stroke in its proper notation to SVG file
	//	3. bounces the points to JSON data that can be broadcast
	// **** RETURNS a JSON object (?)
	
			// x and y are off when the cursor is a crosshair.  have to recalibrate:
			x = e.pageX - 125;
			y = e.pageY - 75;
	
			var coords = new Array(x,y);
			var colorAlias;
			if(yourColor == "black") {
				colorAlias = 1;
			} else if(yourColor == "white") {
				colorAlias = 0;
			}
			
			var strokeQuad;
			var subQuad;
			
			if(y <= 199) {
				if(x <= 199) {
					strokeQuad = 1;
					subQuad = getSubQuad(Math.abs(0 - x),Math.abs(0 - y));
				} else if((x >= 200) && (x <= 399)) {
					strokeQuad = 2;
					subQuad = getSubQuad(Math.abs(200 - x),Math.abs(0 - y));					
				} else if((x >= 400) && (x <= 599)) {
					strokeQuad = 3;
					subQuad = getSubQuad(Math.abs(400 - x),Math.abs(0 - y));					
				} else if((x >= 600) && (x <= 799)) {
					strokeQuad = 4;
					subQuad = getSubQuad(Math.abs(600 - x),Math.abs(0 - y));					
				} else if((x >= 800) && (x <= 1000)) {
					strokeQuad = 5;
					subQuad = getSubQuad(Math.abs(800 - x),Math.abs(0 - y));					
				}
			} else if((y >= 200) && (y <= 399)) {
				if(x <= 199) {
					strokeQuad = 6;
					subQuad = getSubQuad(Math.abs(0 - x),Math.abs(200 - y));			
				} else if((x >= 200) && (x <= 399)) {
					strokeQuad = 7;
					subQuad = getSubQuad(Math.abs(200 - x),Math.abs(200 - y));					
				} else if((x >= 400) && (x <= 599)) {
					strokeQuad = 8;
					subQuad = getSubQuad(Math.abs(400 - x),Math.abs(200 - y));					
				} else if((x >= 600) && (x <= 799)) {
					strokeQuad = 9;
					subQuad = getSubQuad(Math.abs(600 - x),Math.abs(200 - y));					
				} else if((x >= 800) && (x <= 1000)) {
					strokeQuad = 10;
					subQuad = getSubQuad(Math.abs(800 - x),Math.abs(200 - y));					
				}			
			} else if ((y >= 400) && (y <= 600)) {
				if(x <= 199) {
					strokeQuad = 11;
					subQuad = getSubQuad(Math.abs(0 - x),Math.abs(400 - y));					
				} else if((x >= 200) && (x <= 399)) {
					strokeQuad = 12;
					subQuad = getSubQuad(Math.abs(200 - x),Math.abs(400 - y));					
				} else if((x >= 400) && (x <= 599)) {
					strokeQuad = 13;
					subQuad = getSubQuad(Math.abs(400 - x),Math.abs(400 - y));					
				} else if((x >= 600) && (x <= 799)) {
					strokeQuad = 14;
					subQuad = getSubQuad(Math.abs(600 - x),Math.abs(400 - y));					
				} else if((x >= 800) && (x <= 1000)) {
					strokeQuad = 15;
					subQuad = getSubQuad(Math.abs(800 - x),Math.abs(400 - y));					
				}			
			} else {
				// fuck it, not worth analyzing...
			}
					
			var svg = $('#canvas').svg('get');
			svg.circle(x, y, 10, {fill: yourColor, stroke: 'none'});
			cometd.publish('/drawing', { addData: colorAlias + "," + strokeQuad + "," + subQuad });
		
			tempArray += ' { "x" : "' + x + '" , "y" : "' + y + '" , "color" : "' + yourColor + '" } ,';
		
		}
	
	}

})(jQuery);
