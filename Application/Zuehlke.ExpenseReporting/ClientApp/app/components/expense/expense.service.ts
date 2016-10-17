import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Expense } from './expense';

@Injectable()
export class ExpenseService {
    private expenseUrl = 'api/expenses';
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    getExpenses(): Observable<Expense[]> {
        return this.http.get(this.expenseUrl)
            .map(this.mapExpenses)
            .catch(this.handleError);
    }

    getExpense(id: string): Observable<Expense> {
        return this.getExpenses()
            .map((expenses: Expense[]) => expenses.find(p => p.id === id));
    }

    createExpense(expense: Expense): Observable<Response> {
        expense.id = this.generateGuid();
        let dtoExpense = JSON.parse(JSON.stringify(expense));
        dtoExpense.date = this.convertDateToString(expense.date);

        return this.http.post(this.expenseUrl, JSON.stringify(dtoExpense), { headers: this.headers });
    }

    updateExpense(expense: Expense): Observable<Response> {
        const url = `${this.expenseUrl}/${expense.id}`;
  
        let dtoExpense = JSON.parse(JSON.stringify(expense));
        dtoExpense.date = this.convertDateToString(expense.date);

        return this.http.put(url, JSON.stringify(dtoExpense), { headers: this.headers });
    }

    deleteExpense(expense: Expense): Observable<Response> {
        const url = `${this.expenseUrl}/${expense.id}`
        return this.http.delete(url, { headers: this.headers, body: "" });
    }

    private mapExpenses(response: Response) {
        let mappedExpenses = response.json() || [];
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        mappedExpenses.forEach((expense: any) => {
            let dateArray = expense.date.split(".");
            let theDate = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
            let finalDate = new Date(theDate.getTime() - tzoffset);
            expense.date = finalDate.toISOString().slice(0, 10);
        });

        return mappedExpenses;
    }

    private convertDateToString(date: string) : string {
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);

        return day + '.' + month + '.' + year;
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }

    private generateGuid() : string {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

}
