// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCases from '../../../app/controller/cases';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    cases: ExportCases;
    home: ExportHome;
  }
}
