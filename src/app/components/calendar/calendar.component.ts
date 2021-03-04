import { Component, Injectable, OnInit, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { ElectronService } from 'src/app/core/electron.service';
// import { ElectronService } from '../../core/electron.service;

@Component({
    selector: 'app-calendar',
    styleUrls: ['./calendar.component.css'],
    templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {

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

    day = []; // куда записываем дни
    modalDate = { y: Number, m: String, d: Number };


    obj = {}; // объект из 12 месяцев

    unsavedData = [];

    saved = {};
    monthActiveDays = [];

    result;

    showHint: {};
    showThisMonth = 0;
    constructor(private electronService: ElectronService) {
        this.showHint = {};
        this.showThisMonth = 0;
    }

    async ngOnInit(): Promise<void> {
        await this.loadDatas();
        this.createYear(this.year);
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
        console.log(this.monthActiveDays);
    }

    // загружаем данные из json файла
    async loadDatas() {
        this.result = await this.electronService.loadData('data.json');
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
        console.log(data);
        // this.unsevadData надо запихнуть в общую ДАТУ и сохранить
        
        // console.log(this.unsavedData);
        // this.electronService.saveData('data.json', data).then( (res) => {
        //     console.log(res, 'сохранено');
        // });
    }

    closeDayModal() {
        this.addDay = false;
    }

    prevYear() {
        this.createYear(this.year--, true);
    }
    nextYear() {
        this.createYear(this.year++, true);
    }

}
