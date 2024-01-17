import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataStorageService {
    private companyInformationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private studentInformationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private yearTypeNameSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private TypeNameSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor() { }

    updateCompanyInformation(updatedData: any): void {
        this.companyInformationSubject.next(updatedData);
    }

    updateStudentInformation(updatedData: any): void {
        this.studentInformationSubject.next(updatedData);
    }

    getCompanyInformation(): Observable<any> {
        return this.companyInformationSubject.asObservable();
    }

    getStudentInformation(): any {
        return this.studentInformationSubject.value;
    }

    setCompanyInformation(data: any): void {
        this.companyInformationSubject.next(data);
    }

    setStudentInformation(data: any): void {
        this.studentInformationSubject.next(data);
    }

    setYearTypecode(year: string, typeName: string): void {
        const data = { year, typeName };
        this.yearTypeNameSubject.next(data);
    }

    setTypecode( typeName: string): void {
        const data = { typeName };
        this.TypeNameSubject.next(data);
    }

    getYearTypecode(): Observable<any> {
        return this.yearTypeNameSubject.asObservable();
    }
}