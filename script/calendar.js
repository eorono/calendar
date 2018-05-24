function createMonths (inputDate, daysNum) {

	var months = [
		{ name: "January", length: 31 },
		{ name: "February", length: 28 },
		{ name: "March", length: 31 },
		{ name: "April", length: 30 },
		{ name: "May", length: 31 },
		{ name: "June", length: 30 },
		{ name: "July", length: 31 },
		{ name: "August", length: 31 },
		{ name: "September", length: 30 },
		{ name: "October", length: 31 },
		{ name: "November", length: 30 },
		{ name: "December", length: 31 }
	]; 

	var resultMonths = "";
	
	var validDays = 0;

	var daysCounter = inputDate.getDate();
	
	var validDaysInMonth = 0;

	while (validDays < daysNum) {

		var monthIndex = inputDate.getMonth();
		monthIndex = monthIndex > 11 ? 0 : monthIndex;

		resultMonths += "<tr>"+
							"<td colspan='7' class='month-name'>"+ months[ monthIndex ].name+" "+inputDate.getFullYear()+"</td>"+
						"</tr>";

	    var firstDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
	    var startingDay = firstDay.getDay();				

	    if (monthIndex == 1) {
	        if ((inputDate.getFullYear() % 4 == 0 && inputDate.getFullYear() % 100 != 0) || inputDate.getFullYear() % 400 == 0) {
	            months[1].length = 29;
	        } else {
	        	months[1].length = 28;
	        }
	    }

	    resultMonths += "<tr>";
	    for (var i=0; i<7; i++) {

	    	if (i<startingDay) {
	    		resultMonths += "<td class='invalid-day'></td>";
	    	} else if (validDays < daysNum) {

	    		var dateType = isWeekend( new Date(inputDate.getFullYear(), monthIndex, daysCounter) ) ? " weekend" : "";
	    		dateType += isHoliday(daysCounter, monthIndex+1) ? " holiday" : "";

	    		resultMonths += "<td class='valid-day"+dateType+"'>"+daysCounter+"</td>";
	    		daysCounter++;
	    		validDays++;
	    		validDaysInMonth++;
	    	} else { 
	    		resultMonths += "<td class='invalid-day'></td>";
	    	}
	    }
		resultMonths += "</tr>";

		while (validDays < daysNum && daysCounter<=months[monthIndex].length) {
			resultMonths += "<tr>";
		
			for (var i=0; i<7; i++) {
				if (validDays < daysNum && daysCounter<=months[monthIndex].length) {

					var dateType = isWeekend( new Date(inputDate.getFullYear(), monthIndex, daysCounter) ) ? " weekend" : "";
		    		dateType += isHoliday(daysCounter, monthIndex+1) ? " holiday" : "";

		    		resultMonths += "<td class='valid-day "+dateType+"'>"+daysCounter+"</td>";
		    		daysCounter++;
		    		validDays++;
		    		validDaysInMonth++;
		    	} else {
		    		resultMonths += "<td class='invalid-day'></td>";
		    	}
			}
			resultMonths += "</tr>";
		}

		daysCounter = 1;
		resultMonths += "<tr class='month-jump'></tr>";			
		inputDate = addDays(inputDate, validDaysInMonth); 
		validDaysInMonth = 0;
	}

	return resultMonths;
}

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addErrorClass() {
    var element, name, arr;
    element = document.getElementById("calendar");
    name = "errors";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

function removeErrorClass() {
    var element = document.getElementById("calendar");
    element.className = element.className.replace(/\berrors\b/g, "");
}

function isWeekend (date) {
	var day = date.getDay();
	return( (day == 6)||(day == 0) );
}

function isHoliday (date, month) {
	var usaHolidays = [
		{
			date: "1",
			month: "1"
		},
		{
			date: "15",
			month: "1"
		},
		{
			date: "19",
			month: "2"
		},
		{
			date: "28",
			month: "5"
		},
		{
            date: "4",
			month: "7"
		},
		{
			date: "3",
			month: "9"
		},
		{
			date: "8",
			month: "10"
		},
		{
			date: "12",
			month: "11"
		},
		{
			date: "22",
			month: "11"
		},
		{
			date: "25",
			month: "12"
		},
	];

	for (var i=0; i<usaHolidays.length; i++) {
		if (date == usaHolidays[i].date && month == usaHolidays[i].month)
			return true;
		if (month < usaHolidays[i].month)
			return false;		
	}

	return false;	
}

function checkErrorMessages (errors) {

	var resultWrapper = document.getElementById("calendar");
	resultWrapper.innerHTML = "";

	if (Boolean(errors.length)) {
		addErrorClass(); 
		
		var message = "";
		for (var i=0; i<errors.length; i++) {
			message += "<p>"+errors[i]+"</p>";
		}
		resultWrapper.innerHTML = message;

		return true;
	} else {
		removeErrorClass(); 
		return false;
	}
	
}

function calendar () {
	
	var inputDate = document.getElementById("startInput").value.trim();
	var daysNumberInput = document.getElementById("daysNumberInput").value.trim();
	var countryCodeInput = document.getElementById("countryCodeInput").value.trim();

	inputDate = convertUTCDateToLocalDate(new Date(inputDate));

	var errorMessages = [];

	if ( !Boolean(inputDate) ) {
		errorMessages.push("Date missing");
	} 

	if ( !Boolean(daysNumberInput) ) {
		errorMessages.push("Number of days missing");
	} else if( isNaN(daysNumberInput) ) {
		errorMessages.push("Number of days must be a valid number");
	}
 
	if ( !Boolean(countryCodeInput) ) {
		errorMessages.push("Country code missing");
	}

	if ( checkErrorMessages(errorMessages) ) return;

	var daysNames = ["S", "M", "T", "W", "T", "F", "S"];

	var resultCalendar = "<p>Results for:</p>"+
							"<ul>"+
								"<li><b>Start Date:</b> "+(inputDate.getMonth()+1)+"/"+inputDate.getDate()+"/"+inputDate.getFullYear()+"</li>"+
								"<li><b>Number of days:</b> "+daysNumberInput+"</li>"+
								"<li><b>Country Code:</b> "+countryCodeInput+"</li>"+
							"</ul>";
				
	resultCalendar += "<table border='1'>"+
		"<tr>"+
			"<th>"+daysNames[0]+"</th>"+
			"<th>"+daysNames[1]+"</th>"+
			"<th>"+daysNames[2]+"</th>"+
			"<th>"+daysNames[3]+"</th>"+
			"<th>"+daysNames[4]+"</th>"+
			"<th>"+daysNames[5]+"</th>"+
			"<th>"+daysNames[6]+"</th>"+
		"</tr>"+
		createMonths(new Date(inputDate), daysNumberInput)+
	"</table>";

	document.getElementById("calendar").innerHTML = resultCalendar;
}

