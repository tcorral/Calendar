var Calendar = function(){
  this.today = new Date();
  this.month = this.today.getMonth();
	this.year = this.today.getFullYear();
  this.date = this.today.getDate();
  this.selectedDate = -1;
  this.selectedMonth = -1;
  this.selectedYear = -1;
  this.topContainer = null;
  this.changeMonth = null;
  this.monthdaysContainer = null;
  this.weekdaysContainer = null;
  this.locale = null;
  this.selected = null;
  this.changeMonthBehaviour = null;
  this.changeYearBehaviour = null;
  this.onSelectDate = function(day, month, year){
    console.log(day, month, year);
  };
  this.onChangeMonth = function(month, year){
    console.log(month, year);
  };
};
Calendar.prototype.setLocale = function(oLocale){
  this.locale = oLocale;
  if(this.topContainer){
    this._redraw();
  }
  return this;
};
Calendar.prototype._onSelectDate = function(oTarget){
  var date = parseInt(oTarget.getAttribute('data-date'), 10);
  if(!date  || oTarget.parentNode.classList.contains('idle')){
    return;
  }
  this.selected && this.selected.classList.remove('selected');
  this.selected = oTarget;
  oTarget.classList.add('selected');

  this.selectedDate = date;
  this.selectedMonth = this.month;
  this.selectedYear = this.year;
  this.onSelectDate(this.selectedDate, this.selectedMonth, this.selectedYear);
  return this;
};
Calendar.prototype._redraw = function(){
  this.drawWeekDays(this.weekdaysContainer);
  this.drawTopCalendar(this.topContainer);
  this.drawMonthDays(this.monthdaysContainer);
  this.onChangeMonth(this.month, this.year);
  return this;
};
Calendar.prototype.setBehaviour = function(){
  var self = this;
  var oMonthDays = document.getElementById('month_days_calendar');
  var oHeader = document.getElementById('top_calendar');

  oHeader.addEventListener('click', function(event){
    var oTarget = event.target;
    while(oTarget !== document && oTarget.nodeName.toLowerCase() !== "a"){
      oTarget = oTarget.parentNode;
    }
    if(oTarget === document){
      return;
    }
    switch(oTarget.id){
      case 'prev_month':
        --self.month;
        if(self.month < 0){
          self.month = 11;
          self.year--;
        }
        self._redraw();
        break;
      case 'change_month':
        var oList = document.getElementById('month_list');
        if(oList.className.indexOf('hidden') !== -1){
          oList.className = "";
        }else{
          oList.className = "hidden";
        }
        break;
      case 'change_year':
        var oList = document.getElementById('year_list');
        if(oList.className.indexOf('hidden') !== -1){
          oList.className = "";
        }else{
          oList.className = "hidden";
        }
        break;
      case 'next_month':
        ++self.month;
        if(self.month > 11){
          self.month = 0;
          self.year++;
        }
        self._redraw();
        break;
    }
  });
  oMonthDays.addEventListener('click', function(event){
    var oTarget = event.target;
    while(oTarget !== document && oTarget.nodeName.toLowerCase() === "span"){
      oTarget = oTarget.parentNode;
    }
    if(oTarget === document){
      return;
    }
    self._onSelectDate(oTarget);
  }, false);
  return this;
};
Calendar.prototype._getDayOfWeekFirstDayOfMonth = function(){
  var oDate = new Date(this.year, this.month, 1);
  return oDate.getDay() - this.locale.firstDayOfWeek;
};
Calendar.prototype._getDaysInActualMonth = function(){
  var aDaysInMonth = this._getDaysInMonth();
  return aDaysInMonth[this.month];
};
Calendar.prototype._getDaysInPrevMonth = function(){
  var aDaysInMonth = this._getDaysInMonth();
  var month = this.month - 1;
  if(month < 0){
    month = 11;
  }
  return aDaysInMonth[month];
};
Calendar.prototype.gotoToday = function(){
  this.date = this.today.getDate();
  this.month = this.today.getMonth();
  this.year = this.today.getFullYear();
  this._redraw();
  return this;
};
Calendar.prototype.gotoSelectedDate = function(){
  this.date = this.selectedDate;
  this.month = this.selectedMonth;
  this.year = this.selectedYear;
  this._redraw();
  return this;
};
Calendar.prototype.setMonth = function(nMonth){
	this.month = nMonth;
	return this;
};
Calendar.prototype.setYear = function(nYear){
	this.year = nYear;
	return this;
};
Calendar.prototype.setContainer = function(oContainer){
	this.oContainer = oContainer;
	return this;
};
Calendar.prototype.selectDate = function(date, month, year){
  this.selectedDate = date;
  this.selectedMonth = month;
  this.selectedYear = year;
  this._redraw();
  return this;
};
Calendar.prototype._isLeap = function(){
  return ((this.year % 400) === 0) ? 1 :
    ((this.year % 100) === 0) ? 0 :
      ((this.year % 4)   === 0) ? 1 :
        0;
};
Calendar.prototype._getDaysInFebruary = function(){
  if(this._isLeap())
  {
    return 29;
  }
  return 28;
};
Calendar.prototype._getDaysInMonth = function(){
  return [31,this._getDaysInFebruary(),31,30,31,30,31,31,30,31,30,31];
};
Calendar.prototype.getDate = function(){
  return new Date(this.selectedYear,this.selectedMonth,this.selectedDate);
};
Calendar.prototype.yearChangeBehaviour = function(Calendar){
  return function(event){
    var oTarget = event.target;
    while(oTarget !== document && oTarget.nodeName.toLowerCase() !== "li"){
      oTarget = oTarget.parentNode;
    }
    if(oTarget === document){
      return;
    }
    oTarget.classList.add('selected');
    Calendar.year = parseInt(oTarget.getAttribute('data-year'), 10);
    Calendar._redraw();
  };
};
Calendar.prototype.monthChangeBehaviour = function(Calendar){
  return function(event){
    var oTarget = event.target;
    while(oTarget !== document && oTarget.nodeName.toLowerCase() !== "li"){
      oTarget = oTarget.parentNode;
    }
    if(oTarget === document){
      return;
    }
    oTarget.classList.add('selected');
    Calendar.month = parseInt(oTarget.getAttribute('data-month'), 10);
    Calendar._redraw();
  };
};
Calendar.prototype.drawTopCalendar = function(oTopContainer){
  if(this.changeMonth){
    this.changeMonth.removeEventListener('click', this.changeMonthBehaviour);
  }
  if(this.changeYear){
    this.changeYear.removeEventListener('click', this.changeYearBehaviour);
  }
  if(!this.topContainer){
    this.topContainer = oTopContainer;
  }
	var oTemplate = _.template(document.getElementById('top_calendar_tpl').innerHTML);
  var years = [this.year -2, this.year -1, this.year, this.year + 1, this.year + 2];

	oTopContainer.innerHTML = oTemplate({prev: this.locale.prev, next: this.locale.next, months: this.locale.months.long, years: years, indexMonth: this.month, month: this.locale.months.long[this.month], year: this.year});
  var oChangeMonth = this.changeMonth = document.getElementById('month_list');
  this.changeMonthBehaviour = this.monthChangeBehaviour(this);
  oChangeMonth.addEventListener('click', this.changeMonthBehaviour);

  var oChangeYear = this.changeYear = document.getElementById('year_list');
  this.changeYearBehaviour = this.yearChangeBehaviour(this);
  oChangeYear.addEventListener('click', this.changeYearBehaviour);
  return this;
};
Calendar.prototype.drawWeekDays = function(oWeekDaysContainer){
	if(!this.weekdaysContainer){
    this.weekdaysContainer = oWeekDaysContainer;
  }
  var oTemplate = _.template(document.getElementById('weekdays_calendar_tpl').innerHTML);
  var days = this.locale.weekdays.short.concat();
  if(this.locale.firstDayOfWeek === 1){
    var lastDay = days.shift();
    days.push(lastDay);
  }
	oWeekDaysContainer.innerHTML = oTemplate({weekdays: days});
  return this;
};
Calendar.prototype.drawMonthDays = function(oMonthDaysContainer){
	if(!this.monthdaysContainer){
    this.monthdaysContainer = oMonthDaysContainer;
  }
  var oMonthDays = document.getElementById('month_days');
	var oTemplate = _.template(document.getElementById('month_days_calendar_tpl').innerHTML);
  var sHTML = '';
  var firstDayOfWeek = this._getDayOfWeekFirstDayOfMonth();
  var prevMonthDays = this._getDaysInPrevMonth();
  var actualMonthDays = this._getDaysInActualMonth();
  var day = 1;
  var monthDays = [];
  if(firstDayOfWeek !== this.locale.firstDayOfWeek){
    while(firstDayOfWeek--){
      monthDays.unshift({
        className: 'idle',
        date: prevMonthDays--
      });
    }
  }else{
    var nDays = 7;
    while(nDays--){
      monthDays.unshift({
        className: 'idle',
        date: prevMonthDays--
      });
    }
  }
  while(day <= actualMonthDays){
    monthDays.push({
      className: '',
      date: day++
    });
  }
  if(monthDays.length < 42){
    day = 1;
    while(monthDays.length < 42){
      monthDays.push({
        className: 'idle',
        date: day++
      })
    }
  }
  var nMonthDaysLength = monthDays.length;
  var pieces = nMonthDaysLength / 7;
  for(var nIndex = 0; nIndex < pieces; nIndex++){
    sHTML += oTemplate({
      today: this.today.getDate(),
      today_month: this.today.getMonth(),
      today_year: this.today.getFullYear(),
      selected_month: this.selectedMonth,
      selected_date: this.selectedDate,
      selected_year: this.selectedYear,
      month: this.month,
      year: this.year,
      date: this.date,
      firstdayofweek: this.locale.firstDayOfWeek,
      monthdays: monthDays.splice(0, 7) });
  }
	oMonthDaysContainer.innerHTML = sHTML;
  return this;
};