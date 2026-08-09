import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  private mockPatients = [
    { id: 'pat-1', name: 'Ana Lopez', age: 3, weight: 14.2, height: 95, lastVisit: '2026-08-01' },
    { id: 'pat-2', name: 'Carlos Diaz', age: 1, weight: 9.8, height: 75, lastVisit: '2026-07-15' },
  ];

  findAll() {
    return this.mockPatients;
  }

  create(patient: any) {
    const newPatient = { id: `pat-${Date.now()}`, ...patient, lastVisit: new Date().toISOString().split('T')[0] };
    this.mockPatients.push(newPatient);
    return newPatient;
  }
}
