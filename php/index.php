<html><head>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"
	  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
	  crossorigin="anonymous"></script>
<script type="text/javascript">
var dbg
$(document).ready(function () {
	$.getJSON('data.json', (data) => {
		console.log(data);
		let plotData = [];
		$.each(data, (inx, item) => {
			plotData.push([item.ts, parseFloat(item.moisture)])
		})
		console.log(plotData)
        var myChart = Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Sensor Data'
            },
            xAxis: {
                title: { text: 'Date/Time' },
        	    labels:{
        	     formatter: function(){
        	         return Highcharts.dateFormat('%Y %M %d',this.value);
        	     }
        	  }
            },
            yAxis: {
                title: {
                    text: 'Sensor Readout'
                }
            },
            series: [{data: plotData}]
        });
	});
});
</script>

</head>
<body>
<div id="container" style="width:100%; height:400px;"></div>
</body>
</html>