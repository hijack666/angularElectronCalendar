import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { ElectronService } from 'src/app/core/electron.service';
// import { ElectronService } from '../../core/electron.service;

@Component({
    selector: 'app-calendar',
    styleUrls: ['./calendar.component.css'],
    templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, AfterViewInit {

    year = new Date().getFullYear(); // текущий, или переключенный год
    yearLength = 12;
    today = {year: new Date().getFullYear(), month: new Date().toLocaleString('ru', { month: 'long' }), day: new Date().getDate()};

    chosenYear: number;
    event: string;

    month: string; // название месяца
    // monthNames = []; // массив названий месяца
    monthNames;
    activeMonth = [];

    monthLength: number; // длина месяца
    monthLengthArray = []; // массив длин месяца

    emptyNumber: number; // с какого дня недели начинается месяц
    emptyDays = []; // массив пустых дней в начале

    addDay = false; // кликнули по дате

    modalDate = { y: Number, m: String, d: Number };
    clearedDay = { y: Number, m: String, d: Number };

    unsavedData = [];

    saved = {};
    monthActiveDays = [];

    result;

    showHint: {};
    showThisMonth = 0;

    @ViewChild('closeModal', {static: false})
    closeModal: ElementRef;
    @ViewChild('dayModal', {static: false})
    dayModal: ElementRef;
    inputRef: ElementRef | undefined;

    constructor(private electronService: ElectronService, private renderer: Renderer2) {
        this.showHint = {};
        this.showThisMonth = 0;
    }

    ngOnInit(): void {
        this.createYear(this.year);
        this.loadDatas();
    }

    ngAfterViewInit(): void {
        // this.renderer.listen('window', 'click', (e) => {
        //     console.log('click');
        //     if (e.target !== this.closeModal.nativeElement && e.target !== this.dayModal.nativeElement && this.addDay ) {
        //         this.addDay = false;
        //         console.log('click outside');
        //     }
        // });
    }

    createYear(year, clear = false) {

        year = this.year;
        if (clear) {
            this.emptyDays = [];
            this.monthLengthArray = [];
            this.monthNames = [];
        }
        for (let i = 0; i < this.yearLength; i++) { // цикл воссоздать в загрузке файла,
        // и результат единожды записать в переменные, иначе при смене года массив увеличивается
            this.month = new Date(year, i).toLocaleString('ru', { month: 'long' });

            this.monthLength = new Date(year, i + 1, 0).getDate();
            this.monthLengthArray.push(this.monthLength);

            this.emptyNumber = new Date(year, i, 0).getDay();
            this.emptyDays.push( this.emptyNumber );
        }
    }

    // загружаем данные из json файла
    loadDatas() {
        this.electronService.loadData('data.json').then((res) => {
            this.result = res;
            for (let i = 0; i < this.yearLength; i++) {
                this.monthActiveDays.push({activeDays: [], event: [], year: Number || String });
                // В месяце есть активные дни, если его массив имеет длину
                if ( this.result[i].days.length ) {
                    this.result[i].days.filter(d => {
                        this.monthActiveDays[i].activeDays.push(d.day);
                        this.monthActiveDays[i].event.push(d.event);
                        this.monthActiveDays[i].year = d.year;
                    });
                }
            }
            return this.result;
        });
    }

    // очищаем данные (загружаем дефолтную дату), надо будет вывести окошко "вы уверены?"
    loadDefaultDatas() {
        this.electronService.loadDefaultData('dataDefault.json').then((res) => {
            this.result = res;
            return this.result;
        });
    }

    getSavedDate() {
    }

    getArrays(days: number): number[] { // используется
        return [...Array(days).keys()];
    }

    showDate(year, month, day) {
        // console.log(year, month, day);
        this.addDay = true;
        this.modalDate = { y: year, m: month.month, d: day + 1};
    }
    ok() {
        this.addDay = false;
        this.unsavedData.push({ y: this.year, m: this.modalDate.m, d: this.modalDate.d, event: this.event });
        // console.log(this.unsavedData);
        this.event = '';
    }

    // сохраняем данные из json файла
    saveDatas(data) {
        data = this.result;
        // this.unsavedData надо запихнуть в общую ДАТУ и сохранить
        for (let i = 0; i < data.length; i++) {
            this.unsavedData.map((e) => {
                if (e.m === data[i].month) {
                    data[i].days.push({day: e.d, event: e.event, year: e.y});
                }
            });
        }
        console.log(data);
        this.electronService.saveData('data.json', data).then( (res) => {
            console.log(res, 'сохранено');
        });
        this.loadDatas();
    }

    closeDayModal() {
        this.addDay = false;
    }
    clearDay(data, year, month, day) {
        data = this.result;
        this.clearedDay = { y: year, m: month, d: day};
        console.log(this.clearedDay);
        // data[y].days // удалить этот элемент массива, равный this.clearedDay
        for (let i = 0; i < data.length; i++) {
            if (data[i].month === this.clearedDay.m) {
                console.log(this.clearedDay.m);
                const ind = data[i].days.map( (d) => {
                    return d.day;
                }).indexOf(this.clearedDay.d);
                // console.log(ind);
                data[i].days.splice(ind, 1);
            }
        }
        // this.unsavedData = data;
        console.log(data);
        // надо замутить что-то типа unsavedClearDay = []; и удалять из объекта итые части массива
        // после сохранения this.clearedDay = {}, затем загрузить ДАТУ
    }

    prevYear() {
        this.createYear(this.year--, true);
    }
    nextYear() {
        this.createYear(this.year++, true);
    }

}
