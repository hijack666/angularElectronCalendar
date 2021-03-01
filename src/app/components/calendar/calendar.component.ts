import { Component, Injectable, OnInit } from '@angular/core';
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

    chosenYear: number;
    event: string;

    month: string; // название месяца
    monthNames = []; // массив названий месяца
    activeMonth = [];

    monthLength: number; // длина месяца
    monthLengthArray = []; // массив длин месяца

    emptyNumber: number; // с какого дня недели начинается месяц
    emptyDays = []; // массив пустых дней в начале

    clicked = false; // кликнули по элементу

    day = []; // куда записываем дни

    obj = {}; // объект из 12 месяцев

    saved = {};
    data = {
        январь: [],
        февраль: [],
        март: [],
        апрель: [],
        май: [],
        июнь: [],
        июль: [],
        август: [],
        сентябрь: [],
        октябрь: [],
        ноябрь: [],
        декабрь: []
    };

    result;

    constructor(private electronService: ElectronService) {
    }

    ngOnInit(): void {
        this.createYear(this.year);
    }

    async createYear(year, clear = false) {
        await this.loadDatas();
        console.log('TYT', this.result);
        console.log(year);
        year = this.year;
        if (clear) {
            this.emptyDays = [];
            this.monthLengthArray = [];
            this.monthNames = [];
        }
        for (let i = 0; i < this.yearLength; i++) {
            this.month = new Date(year, i).toLocaleString('ru', { month: 'long' });
            // console.log(this.month);
            this.monthNames.push({month: this.month, active: false});
            if (this.monthNames[i].month === this.result.month) {
                console.log('совпадение');
                // this.activeMonth.push(true);
                this.monthNames[i].active = true;
                // console.log(this.activeMonth);
            }

            this.monthLength = new Date(year, i + 1, 0).getDate();
            this.monthLengthArray.push(this.monthLength);

            this.emptyNumber = new Date(year, i, 0).getDay();
            this.emptyDays.push( this.emptyNumber );
            // this.activeMonth = false;
            // this.getSavedDate(i); // получаем данные с локал и записываем в объект
            // this.getSavedDate(i); // получаем данные с локал
            // this.loadDatas();
        }
        console.log(this.monthNames);
        // console.log(this.activeMonth);
    }

    // загружаем данные из json файла
    async loadDatas() {
        // data = await this.electronService.loadData('data.json').then((res) => {
        //     // this.result = res;
        //     data = res;
        //     // console.log(res);
        // });
        // data = await this.electronService.loadData('data.json');
        // console.log('dasds', data);
        this.result = await this.electronService.loadData('data.json');
        return this.result;
    }

    // сохраняем данные из json файла
    saveDatas(data) {
        data = { year: 2021, month: 'февраль', day: 25};
        this.electronService.saveData('data.json', data).then( (res) => {
            console.log(res, 'сохранено');
        });
        // this.electronService.saveData('data.json', data);
    //     // this.saved["январь"].push(obj);
    //     // console.log(this.saved);
    //     this.fs.writeFile('data.txt', 'sdadsa');
    }

    getSavedDate() {
    }

    getArrays(days: number): number[] { // используется
        return [...Array(days).keys()];
    }

    showDate(day, month) {
        console.log(day, month);
        // day = this.day.indexOf(day);
        // if ( day > -1) {
        //     this.day.slice(day, 1);
        // } else {
        //     this.day.push(day);
        // }
        // console.log(this.day, month);

        var pickedData = {
            'year': this.chosenYear,
            'day': this.day,
            'event': this.event
        }

    }

    prevYear() {
        this.createYear(this.year--, true);
    }
    nextYear() {
        this.createYear(this.year++, true)
    }



}