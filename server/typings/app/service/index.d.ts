// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCases from '../../../app/service/Cases';
import ExportData from '../../../app/service/Data';
import ExportMongo from '../../../app/service/Mongo';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    cases: AutoInstanceType<typeof ExportCases>;
    data: AutoInstanceType<typeof ExportData>;
    mongo: AutoInstanceType<typeof ExportMongo>;
    test: AutoInstanceType<typeof ExportTest>;
  }
}
