import { MatchRecord } from './MatchRecord';

export class MatchRecordsStorage {
  private dbName: string;

  constructor(dbName: string = 'records') {
    this.dbName = dbName;
    this.check();
  }

  private check(): void {
    if (!window['localStorage']) {
      alert('ERROR: No es posible almacenar datos en el navegador.');
      throw new StorageException('Local storage no disponible');
    }
  }

  private encode(records: Array<MatchRecord>): string {
    return JSON.stringify(records);
  }

  private decode(json: string): Array<MatchRecord> {
    const list = JSON.parse(json) as Array<any>;
    return list.map((item: any) => MatchRecord.fromJSON(item));
  }

  public reset(): void {
    this.set(new Array());
  }

  public set(records: Array<MatchRecord>): void {
    this.check();
    window.localStorage.setItem(this.dbName, this.encode(records));
  }

  public get(): Array<MatchRecord> {
    this.check();
    const json = window.localStorage.getItem(this.dbName);
    return json ? this.decode(json) : new Array();
  }
}

export class StorageException extends Error {}
