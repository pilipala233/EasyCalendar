let template = document.createElement("template");

template.innerHTML = `
<style>
* {
    user-select: none;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .calendar_wrap {
    width: 1280px;
    margin: 100px auto;
    position: relative;
    padding-bottom: 10px;
    border-radius: 20px;
    box-shadow: 10px 10px 50px 10px #ccc;
  }


    
    .pick_year_month {
      width: 100%;
      height: 80px;
      line-height: 80px;
      text-align: center;
      background: #cdb092;
      border-radius: 20px 20px 0 0;
    }
    .pick_year_item {
      margin: 0 20px;
      font-size: 24px;
      font-weight: 600;
    }
    .date_action {
      cursor: pointer;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align:center;
      line-height: 30px;
      background: #d6d4d4;
      color: #b1afaa;
      font-size: 24px;
      margin: 0 4px;
    }
    .change_num_txt {
        color: #000;
    }
    .weekday,
    .month_days {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .weekday_item,
    .days_item {
        width: 80px;
        margin: 0 50px;
        text-align: center;
        font-size: 20px;
    }
    .weekday {
      margin-bottom: 20px;
      font-weight:600;
    }
    .days_item {
      height: 80px;
      margin-bottom: 10px;
      padding-top: 5px;
      text-align: center;
      line-height: 80px;
      font-size: 24px;
      font-weight: bold;
    }

    .day_color {
        color: #5678FE;
        background: #bb7665;
        color: #fff;
        border-radius: 50%;
    }

    .gray_color {
        color: #acacac;
    }

    .red_color {
        color: #c26228;
    }

    .blue_color {
        color: #c26228;
    }
    .real_day {
      cursor: pointer;
    }
    .real_day:hover {
        outline: 1px solid orange;
        border-radius: 5px;
        box-shadow: 0 0 2px 2px orange;
    }
    .select_day_active {
        outline: 1px solid orange;
    }

    </style>
<div class="calendar_wrap" id="calendar_container">
  <div class="pick_year_month">
    <span class="pick_year_item" id="decrease_year">◀ </span>
    <span class="pick_year_item" id="decrease_month">◀ </span>
    <span class="pick_year_item"><span class="change_num_txt" id="year_num">2019</span>年<span class="change_num_txt" id="month_num">1</span>月
    </span>
    <span class="pick_year_item" id="increase_month"> ▶</span>
    <span class="pick_year_item" id="increase_year"> ▶</span>
  </div>
  <ul class="weekday">
    <li class="weekday_item blue_color">日</li>
    <li class="weekday_item">一</li>
    <li class="weekday_item">二</li>
    <li class="weekday_item">三</li>
    <li class="weekday_item">四</li>
    <li class="weekday_item">五</li>
    <li class="weekday_item blue_color">六</li>
  </ul>
  <ul class="month_days" id="getdays">
  </ul>
  <slot name="customBox">
  </slot>
</div>
`
class CustomCalendar extends HTMLElement {
    #shadowDom
    constructor() {
        super();
        this.#shadowDom = this.attachShadow({ mode: "open" })
        this.#shadowDom.appendChild(template.content.cloneNode(true));

        this.date = new Date(); //获取当前日期
        this.year = this.date.getFullYear();
        this.curYear = this.year;
        this.month = this.date.getMonth() + 1;
        this.curMonth = this.date.getMonth() + 1; // 当前月份
        this.day = this.date.getDate();

        // 触发自定义事件, 将年月传递给父组件
        //this.dispatchEvent(new CustomEvent('init', { detail: { year: this.year, month: this.month } }))

        this.initDays();
        this.addEvent();

    }
    initDays() {
        this.month_days_wrap = this.#shadowDom.getElementById('getdays');
        this.year_change_txt = this.#shadowDom.getElementById('year_num');
        this.month_change_txt = this.#shadowDom.getElementById('month_num');
        this.year_change_txt.innerHTML = this.year;
        this.month_change_txt.innerHTML = this.month;
        this.getMonthDays(this.year, this.month);
    }

    // 当观察的属性发生变化时，该方法会被触发
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`属性 ${name} 由 ${oldValue} 变为 ${newValue}`);
        // 处理属性变化的逻辑...
    }
    static get observedAttributes() { return ['config']; }
    connectedCallback() {
        // 在元素被添加到页面时触发自定义事件
        this.dispatchEvent(new CustomEvent('init', { detail: { year: this.year, month: this.month } }));

    }



    changeCurrentYearMonth(op, type) {
        this.month_days_wrap.innerHTML = '';
        if (op === 'inc') {
            this[type] = this[type] + 1;
            if (type === 'month' && this[type] > 12) {
                this[type] = 1
                this.year = this.year + 1;
                this.year_change_txt.innerHTML = this.year;
            }
        } else {
            this[type] = this[type] - 1;
            if (type === 'month' && this[type] === 0) {
                this[type] = 12
                this.year = this.year - 1;
                this.year_change_txt.innerHTML = this.year;
            }
        }
        var opEle = type + '_change_txt';
        this[opEle].innerHTML = this[type];
        this.dispatchEvent(new CustomEvent('change', { detail: { year: this.year, month: this.month } }))
        this.getMonthDays(this.year, this.month);
    }
    clickDayItem(day) {
        // 子组件向父组件传递值
        const event = new CustomEvent('dayClick', { detail: day }); // 修正事件触发部分
        this.dispatchEvent(event);

    }

    addEvent() {
        var container = this.#shadowDom.getElementById('calendar_container');
        var self = this;
        container.addEventListener('click', function (e) {
            switch (e.target.id) {
                case 'increase_year':
                    self.changeCurrentYearMonth('inc', 'year');
                    break;
                case 'decrease_year':
                    self.changeCurrentYearMonth('dec', 'year');
                    break;
                case 'increase_month':
                    self.changeCurrentYearMonth('inc', 'month');
                    break;
                case 'decrease_month':
                    self.changeCurrentYearMonth('dec', 'month');
                    break;
            }
            if (e.target.className.includes('real_day')) {
                self.clickDayItem(e.target.innerHTML);
            }
        })
    }
    getMonthDays(yearNums, monthNums) {
        // 当月最后一天
        var date1 = new Date(yearNums, monthNums, 0);
        // 当月第一天
        var date2 = new Date(yearNums, monthNums - 1, 1);
        // 上个月最后一天
        var date3 = new Date(yearNums, monthNums - 1, 0);

        var last_month_day = date3.getDate(); // 日期
        var insert_before_nums = date2.getDay(); // 当月第一天星期
        var insert_after_nums = date1.getDay(); // 当月最后一天星期
        var days = date1.getDate();

        for (var i = 1; i <= days; i++) {
            let dates = new Date(yearNums, monthNums - 1, i);
            var li = document.createElement('li');
            li.className = 'days_item real_day';
            li.innerHTML = i;
            var isWeekend = dates.getDay();
            if (isWeekend === 0 || isWeekend === 6) { // 周六日
                li.className = 'days_item real_day blue_color';
            }
            this.month_days_wrap.appendChild(li);
        }
        if (monthNums === this.curMonth && yearNums === this.curYear) {  //今日日期显示色
            var today = this.#shadowDom.querySelectorAll('.days_item')[this.day - 1];
            today.className = "days_item real_day day_color"

        }
        for (let i = 0; i < insert_before_nums; i++) { // 上月后几天
            var days_one = this.#shadowDom.querySelectorAll('.days_item')[0];
            var lis = document.createElement('li');
            lis.className = 'days_item gray_color';
            lis.innerHTML = last_month_day--;
            this.#shadowDom.querySelector('.month_days').insertBefore(lis, days_one);
        }
        for (let i = 1; i <= 6 - insert_after_nums; i++) { // 下月前几天
            var lis = document.createElement('li');
            lis.className = 'days_item gray_color';
            lis.innerHTML = i;
            this.#shadowDom.querySelector('.month_days').appendChild(lis);
        }

    }

}
customElements.define('a-calendar', CustomCalendar);