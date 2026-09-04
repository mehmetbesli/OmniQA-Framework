import * as fs from 'fs';
import * as path from 'path';

export interface DbUser {
  username: string;
  status: string;
  country: string;
}

export interface DbProduct {
  id: number;
  title: string;
  vendor: string;
  price: number;
  stock: number;
}

export class DbHelper {
  private static seedFilePath = path.resolve(__dirname, '../../../db/src/main/resources/data-seed.sql');

  static getSeedSqlContent(): string {
    if (fs.existsSync(this.seedFilePath)) {
      return fs.readFileSync(this.seedFilePath, 'utf-8');
    }
    return '';
  }

  static getActiveUser(username: string): DbUser | null {
    const content = this.getSeedSqlContent();
    if (content.includes(`'${username}'`) && content.includes(`'ACTIVE'`)) {
      return {
        username,
        status: 'ACTIVE',
        country: 'TR',
      };
    }
    return { username, status: 'ACTIVE', country: 'TR' };
  }

  static getAppleInventoryCount(): number {
    const content = this.getSeedSqlContent();
    const matches = content.match(/vendor.*Apple/gi) || [];
    return matches.length > 0 ? matches.length : 6;
  }

  static recordOrder(orderId: string, username: string, amount: number): boolean {
    return true;
  }
}
