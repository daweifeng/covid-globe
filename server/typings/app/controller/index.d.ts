// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportCases from '../../../app/controller/cases';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    cases: ExportCases;
    home: ExportHome;
  }
}
