(function () {
	/*********************/
	/*INITIALIZATION PART*/
	/*********************/

	var barColors = [];
	var calculateTime = function(){
		/*Calculates and updates days-left div with exact time left till the deadline of the course.*/
		var d = new Date(deadline);
		var currentDate = new Date();
		daysLeftElement = document.getElementById("days-left");
		var diff = new Date(d.getTime() - currentDate.getTime());
		var years = diff.getUTCFullYear() - 1970; // Gives difference as year
		var months = diff.getUTCMonth(); // Gives month count of difference
		var days = diff.getUTCDate()-1; // Gives day count of difference
		var seconds = diff.getUTCSeconds();
		var minutes = diff.getUTCMinutes(); // Gives day count of difference
		if(currentDate>d){
			daysLeftElement.innerHTML = '<b><font color="red">Project is overdued:</b></font> '
		}
		else{
			daysLeftElement.innerHTML = 'Time left: ' + days + ' days,  '+ minutes + ' minutes, ' + seconds + ' seconds.';	
		}
		setInterval(calculateTime, 1000);
	}
	
	/**************************/
	/*DECLARING FUNCTIONS PART*/
	/**************************/
	var draw_chart_stories = function(){
		var ctx = document.getElementById("myChart").getContext('2d');
		var myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: [
		        	'Stories from general backlog',
		        	'Stories from product backlog',
		        	'Stories from Sprint#1 backlog',
		        	'Stories from Sprint#2 backlog'
		        ],
		        datasets: [{
		            label: '# of Stories',
		            data: [stories_backlog_primary_0,stories_backlog_primary_1,stories_backlog_secondary_0,stories_backlog_secondary_1],
		            backgroundColor: [
		            	'rgba(255, 99, 130, 0.2)',
		            	'rgba(255, 99, 50, 0.2)',
		            	'rgba(255, 99, 70, 0.2)',
		            	'rgba(255, 99, 90, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		    	responsive: false, //enables chart to resize to its canvas.
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}

	var fill_quiz_results = function(){
		/*	
			Sends POST request to the server to get a list of profiles and their quiz scores.
			//TODO Code situations when there are multiple quizes for a Course instance.
		*/
		let data = new FormData();
		data.append('course_id', courseId);
		var whoPassed;
		ajaxCall('POST','/course/who_passed/', data, function(data){
				whoPassed = JSON.parse(data)['who_passed']
				console.log(whoPassed);
				for (let i = 0; i < whoPassed.length; i++){
					console.log(whoPassed[i][0]);
					console.log(whoPassed[i][1]);
					document.getElementById("quiz_points_" + whoPassed[i][0]).innerHTML =  whoPassed[i][1];
					document.getElementById("quiz_result_" + whoPassed[i][0]).innerHTML =  whoPassed[i][2];

				}
			}
		);
	}
	/**************************/
	/* 			MAIN		  */
	/**************************/
	draw_chart_stories(); //Draw chart for stories.
	calculateTime();
	//Check who passed quizes
	fill_quiz_results();



}());//End of IIFE function.

