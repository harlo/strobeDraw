<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link rel="stylesheet" style="text/css" href="stylesheets/macchina.css" />
    <script type="text/javascript" src="http://hotsocieties.com/proj/drawserver-v1/drawlogs/getStuff.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.json-2.2.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cometd.js"></script>
    <script type="text/javascript" src="js/application.js"></script>
    <script type="text/javascript" src="js/macchina.js"></script>
    <script type="text/javascript" src="js/jquery.svg.js"></script>
    <script type="text/javascript" src="js/json.js"></script>
    <script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>
<body>

<div id="canvas_wrap">	
	<div id="canvas" onmouseover="startDrawState();" onmouseout="killDrawState();"></div>
</div>

</body>
</html>
