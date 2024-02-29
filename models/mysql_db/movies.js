import mysql from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import { createConnection } from 'node:net';

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '181100mysqlAM',
  database: 'storedb'
}

const connection = await mysql.createConnection(config)


export class MovieModel {
  static async getAll ({ genre }) {
    const [products] = await connection.query(
      'SELECT id, nombre, precio, picante, ingredientes, moneda, imagen from product;'
    )
    return products
  }
  static async getById ({ id }) {

  }
  static async create ({ input }) {

  }
  static async update ({ id, input }) {

  }
  static async delete ({ id }) {

  }
}