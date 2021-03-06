import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense.routing';
import { ExpenseOverviewComponent } from './components/expense-overview.component';
import { ExpenseService } from './services/expense.service';

@NgModule({
    imports: [
        CommonModule, 
        ExpenseRoutingModule
    ],
    declarations: [
        ExpenseOverviewComponent,
    ],
    providers: [
        ExpenseService
    ]
})
export class ExpenseModule {
}