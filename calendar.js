/*
    * Author @ Aryashree Pritikrishna
    * Date @ 19June2014
    * 
    *
    * ********Dependencies********
    * jQuery
    * http://code.jquery.com/jquery-1.9.1.js
    *
    * Date Format 1.2.3
    * http://stevenlevithan.com/assets/misc/date.format.js
    * Attached with this plugin
    *
    * ********Plugin arguments********
    * option({data}) - mandatory via object for constructor
    *        Calling a method
    *             $("selector").calendar({"<parameters>"});
    *
    * ********Defaults********
    * weekstart: "SUN",
    * previousyear: true,
    * futureyear: true,
    * previousmonth: true,
    * futuremonth: true,
    * dateClick: function (e) { },
    * montyyearclick: function () { },
    * nextclickcallback: function (e) {},
    * previousclickcallback: function (e) { },
    * legendcolumn: 2,
    * month: <Current Month>,
    * year: <Current Year>,
    * dateformat:"mm/dd/yyyy",
    * data:{"legend":[]}
    * 
    * ********Options********
    * weekstart - string, to make start with the week format ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    * previousyear - bool, to enable or disable to see the prvious year calendar from the given date
    * futureyear - bool, to enable or disable to see the future year calendar from the given date
    * previousmonth - bool, to enable or disable to see the prvious month calendar from the given date
    * futuremonth - bool, to enable or disable to see the prvious month calendar from the given date
    * dateClick: function (e) { }, event handler function for the date is click event e-is click addition e.date=clicked date object
    * montyyearclick: function () { }, event handler function for the month,year header event
    * nextclickcallback: function (e) {}, callback function for navigation next button after click event
    * previousclickcallback: function (e) { }, callback function for navigation previous button after click event
    * legendcolumn - int, specify number of columns to be displayed for legend
    * month - string, month input to calendar format ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    * year - string, year input to calendar format "YYYY"
    * dateformat - string, supported formats ["mm/dd/yyyy","m/d/yy","mmm d, yyyy","mmmm d, yyyy","dddd, mmmm d, yyyy","yyyy-mm-dd"]
    * data - object, 
    * 
    * ********Css Class******
    * calendarwidget //(wrapper elemnt)
    * calendar //(calendar div element have two child div's for calendar header "class=calendar-header"(empty div with back ground color) and calendar "class=calendar-month"))
    * calendar-header //empty div 
    * calendar-month //have two chid tables table1 for navigation buttons and month year text, table2 have the calander "class=calendar-dates"
    * calendar-month-nav // for navigation buttons enabled
    * calendar-month-text // for month year text
    * calendar-month-nav-disab // for navigation buttons disabled
    * legend // have a table 
    * legend-hlt // is a div for legend colors
    * calendar-dates // is a calander table
    * calendar-dates-td-enab // for the selected month date
    * calendar-dates-td-disab // for prev and future month dates
    *
    *********Tested******
    * IE8
    * FireFox 17.0
    * Chrome 26
    
*/
(function ($) {

    $.fn.calendar = function (options) {
        //var $this;// = $(this)[0];
        var init = function ($this) {
            //throw error if month input is not valid
            if($.inArray(($this.month).toUpperCase(), $this.MonthNameShort)==-1)
            {
                throw "Month is not defined in proper format"
            }
            $($this).empty();    
            // if the variable is empty draw it or use the exis one on second call
            if(!$this.leg)
            {
                $this.leg = createLegend($this,$this.settings.data, $this.settings.legendcolumn);
            }
            $this.divCal = $("<div>").addClass("calendar drop-shadow lifted");
            $this.divHe = $("<div>").addClass("calendar-header").html("&nbsp;");
            $this.calMon = $("<div>").addClass("calendar-month");
            //create a calendar header which returns the table object
            var calenHeader=createCalHeader($this,$this.month, $this.year);
            //create a calendar which returns the table object
            var calen=createCalendar($this,$this.month, $this.year, $this.day_names, $this.settings.weekstart);
            $($this.calMon).append(calenHeader);
            $($this.calMon).append(calen);
            $($this.divCal).append($this.divHe).append($this.calMon);
            //$($this).append(divShader).append(leg).append(divCal);
            $($this).append($this.leg).append($this.divCal);
            
            
            //createCalHeader($this.month, $this.year);
            
        }
        var createCalHeader = function ($this,month, year) {
            /*
            * crate a header which have two navigation buttons and month year specified in the middle
            * attach a event handler with argument string as direction
            */
            var calHeaTable = $("<table>").css({ "width": "100%" });
            var calHeaTr = $("<tr>").css({ "width": "100%" });
            var calHeaTdPrev = $("<td>").addClass("calendar-month-nav clender-month-prev").html("<img src='images/left-dark-left.png' />").click(function(e){eventHanCalHedNavi(e,"prev",$this);}).css({"cursor":"pointer"});
            //var calHeaTdTitle = $("<td>").addClass("calendar-month-text").html(month.toUpperCase() + "," + " "+year).click($this.settings.monthyearclick);
            var calHeaTdTitle = $("<td>").addClass("calendar-month-text").html(month.toUpperCase()).click($this.settings.monthyearclick);
                        var calHeaTdNext = $("<td>").addClass("calendar-month-nav clender-month-next").html("<img src='images/right-dark-arrow.png' />").click(function(e){eventHanCalHedNavi(e,"next",$this);}).css({"cursor":"pointer"});
                        $(calHeaTr).append(calHeaTdPrev).append(calHeaTdTitle).append(calHeaTdNext);
                        $(calHeaTable).append(calHeaTr);
            var currentDate=new Date(($.inArray($this.settings.month.toUpperCase(),$this.MonthNameShort)+1)+"/01/"+$this.settings.year);
            var prvMonDat = new Date(($.inArray($this.month.toUpperCase(),$this.MonthNameShort)+1)+"/01/"+$this.year);
            prvMonDat.setMonth((prvMonDat.getMonth() -1));
            var nextMonDat = new Date(($.inArray($this.month.toUpperCase(),$this.MonthNameShort)+1)+"/01/"+$this.year);
            nextMonDat.setMonth((nextMonDat.getMonth() +1));
            //logic to enable and disable the nav buttons with the options
            if(!$this.settings.previousyear){
                if( prvMonDat.getFullYear() <= (currentDate.getFullYear())-1 )
                {
                    $(calHeaTdPrev).unbind("click").addClass("calendar-month-nav-disab").css({"cursor":"default"});
                                        $(calHeaTdPrev).html("<img src='images/calendar-arrow-left.png' />"); 
                }
            }
            if(!$this.settings.futureyear){
                if( nextMonDat.getFullYear() >= (currentDate.getFullYear())+1 )
                {
                    $(calHeaTdNext).unbind("click").addClass("calendar-month-nav-disab").css({"cursor":"default"});                                     
                                        $(calHeaTdNext).html("<img src='images/calendar-arrow-right.png' />");
                                        
                }
            }
            if(!$this.settings.previousmonth){
                if(currentDate.getFullYear()>=currentDate.getFullYear() && (currentDate.getMonth()-1)==prvMonDat.getMonth())
                {
                    $(calHeaTdPrev).unbind("click").addClass("calendar-month-nav-disab").css({"cursor":"default"});
                                        $(calHeaTdPrev).html("<img src='images/calendar-arrow-left.png' />"); 
                }
            }
            if($this.settings.futuremonth){
                if((nextMonDat.getFullYear()>=(currentDate.getFullYear()+1)) && (nextMonDat.getMonth()==3))
                {
                
                    $(calHeaTdNext).unbind("click").addClass("calendar-month-nav-disab").css({"cursor":"default"});
                                        $(calHeaTdNext).html("<img src='images/calendar-arrow-right.png' />");
                }
            }
            return calHeaTable;
        }
        var eventHanCalHedNavi=function(e,type,$this){
            //increment or decrement the month and year variables by the date
            var sign=type=="next"?1:-1;// sign variable decides to increment or decrement
            var stDate = new Date(($.inArray($this.month.toUpperCase(),$this.MonthNameShort)+1)+"/01/"+$this.year);
            var prvMonDat = stDate;
            prvMonDat.setMonth((prvMonDat.getMonth() + sign));
            $this.month = $this.MonthNameShort[prvMonDat.getMonth()];
            $this.year = prvMonDat.getFullYear();
            //console.log($this.month+"-"+$this.year);
            init($this);
            //callback method from the action to call after the click event
            if(type=="next")
            {
                $this.settings.nextclickcallback(e);
            }else{
                $this.settings.previousclickcallback(e);
            }            
        }
        var createLegend = function ($this,obj, noOfCol) {
            var legendDiv, noOfLgd, noOftr, legTable, trIndex = 0;
            legendDiv = $("<div>").addClass("legend");
            // Get the length of the legends
            noOfLgd = obj.legend.length;
            // Calculate how many row to be genrated with number of column specified in options or default
            noOftr = parseInt(noOfLgd / noOfCol) + (noOfLgd % noOfCol > 0 ? 1 : 0);
            legTable = $("<table>");
            for (var i = 0; i < noOftr; i++) {
                var legTr = $("<tr>");
                for (var j = 0; j < noOfCol; j++) {
                    var legcolor = "", legtitle = "";
                    //check if legend is available else pass empty string to crate a empty cells
                    if (obj.legend[trIndex]) {
                        legcolor = obj.legend[trIndex].color;
                        legFontcolor = obj.legend[trIndex].fontColor;
                        legtitle = obj.legend[trIndex].title;
                    }
                    var legTdColor = $("<td>");
                    var legDiv = $("<div>").addClass("legend-hlt").css({ "background-color": legcolor});
                    $(legTdColor).append(legDiv);
                    var legSpnTitle = $("<span>").text(legtitle);
                    var legDivTitle = $("<div>").append(legSpnTitle);
                    var legTdTitle = $("<td>").append(legDivTitle);
                    $(legTr).append(legTdColor).append(legTdTitle);
                    trIndex++;
                }
                $(legTable).append(legTr);
            }
            $(legendDiv).append(legTable);
            //$($this).append(legTable);
            return legendDiv;
        }
        var createCalendar = function ($this,month, year, day_names, weekstart) {
            //create the calendar with mont year argument
            var stDate,startDay, curentMonthNoOfDates, prvMonDat, indexOfDay, dayNamesOrdered, indexOfStartDay, prevMonthStartDate, calTable, calThTr, startDay;
            //Get the start date of the month and year
            stDate = new Date(($.inArray(month.toUpperCase(),$this.MonthNameShort)+1)+"/01/"+year);
            //Get the start day of the start date
            startDay = day_names[stDate.getDay()];
            //Get no of days in current month
            curentMonthNoOfDates = getDaysInMonth(stDate);           
            //Get the index of the day to reorder to the customized option which week to start
            indexOfDay = $.inArray((weekstart).toUpperCase(), day_names);
            if (indexOfDay == -1) {
                throw "weekstart is not defined proper the format of week days are SUN, MON, TUE, WED, THU, FRI, SAT";
            }
            dayNamesOrdered = [];
            for (i = 0; i < day_names.length; i++) {
                dayNamesOrdered.push(day_names[indexOfDay]);
                indexOfDay = indexOfDay == day_names.length - 1 ? 0 : indexOfDay + 1;
            }
            //Get the index where to start the date 1
            indexOfStartDay = $.inArray((startDay).toUpperCase(), dayNamesOrdered);    
            //Calculate prv month remaining days to attach with this month
            var dates=new Date(stDate);
            dates.setDate(dates.getDate()-indexOfStartDay);
            //make loop to create the table
            calTable = $("<table>").addClass("calendar-dates");
            //Creating header weeks with the rearranged array
            calThTr = $("<tr>");
            for (var i = 0; i < dayNamesOrdered.length; i++) {
                var calTh = $("<th>").html(dayNamesOrdered[i]);
                $(calThTr).append(calTh);
            }
            $(calTable).append(calThTr);
            /*
            * Arrange the dates in loop with "prevMonthStartDate"
            */
            var dateEnbCss="calendar-dates-td-enab";
            var dateDisCss="calendar-dates-td-disab";
            var currentDate=new Date();
            for (var i = 0; i < 6; i++) {
                var calTr = $("<tr>");
                for (var j = 0; j < 7; j++) {  
                    //copied the referance to attach it in click
                    var d=new Date(dates);                  
                    var calTd = $("<td>");
                    //closure function to click event to get the date
                    var calDivDt=$("<div>").html(dates.getDate()).click((function( clkDate ){
                                     return function(e){
                                        e.date=new Date(clkDate);
                                        $this.settings.dateClick(e);
                                     }
                                    })(d) );
                        
                    if(dates.getMonth()==stDate.getMonth()){
                        $(calDivDt).addClass(dateEnbCss);
                    }else{
                        $(calDivDt).addClass(dateDisCss).unbind("click");
                    }
                    if(dates.toLocaleDateString()==currentDate.toLocaleDateString())
                    {
                        $(calDivDt).css({"font-weight":"bold"});
                    }
                    $(calTd).append(calDivDt);
                    var aaa=7;//$this.settings.data.legend.length;
                    for(var k=0;k<$this.settings.data.legend.length;k++)
                    {
                        if($.inArray(dates.format($this.settings.dateformat),$this.settings.data.dateList[$this.settings.data.legend[k].code])!=-1){
                            if($(calDivDt).attr('class') != dateDisCss){
                                $(calDivDt).css({"background-color":$this.settings.data.legend[k].color});
                                if(($this.settings.data.legend[k].fontColor != null)&&($this.settings.data.legend[k].fontColor != undefined)){
                                    $(calDivDt).css({"color":$this.settings.data.legend[k].fontColor});
                                }
                            }
                        }
                    }
                    $(calTr).append(calTd);
                    dates.setDate(dates.getDate()+1);
                }
                $(calTable).append(calTr);
            }
            //$($this).append(calTable);
            return calTable;
        }
        var getDaysInMonth = function (date) {
            var month = date.getMonth();
            var year = date.getYear();
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
                return 29;
            } else {
                return daysInMonth[month];
            }
        }
        return this.each(function () {
            $this=this;   
            this.MonthNameShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            this.day_names = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            this.settings = $.extend({
                data:{"legend":[]},                 
                weekstart: "sun",
                previousyear: true,
                futureyear: true,
                previousmonth: true,
                futuremonth: true,
                dateClick: function (e) { },
                monthyearclick: function () { },
                nextclickcallback: function (e) {},
                previousclickcallback: function (e) { },
                legendcolumn: 2,
                month: this.MonthNameShort[new Date().getMonth()],
                year: new Date().getFullYear(),
                dateformat:"mm/dd/yyyy"
            }, options);
            $this.month = $this.settings.month;
            $this.year = $this.settings.year;
            if (!$this.settings.data) {
                throw "There is no data to create the calendar"
            }
            init($this);
        });
    }
})(jQuery);


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var    _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "mm/dd/yyyy",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    isoDate:        "yyyy-mm-dd"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
