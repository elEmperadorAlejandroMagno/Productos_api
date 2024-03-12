import mysql from 'mysql2/promise';


const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '181100mysqlAM',
  database: 'storedb'
}

const connection = await mysql.createConnection(config)


export class MovieModel {
  static async getAll ({ type }) {
    // Tarea filtrar por genero
    if (type) {
      const lowerCaseType = type.toLowerCase()
      // get type ids from database table using type names
      const [types] = await connection.query(
        'SELECT id, nombre FROM genre WHERE LOWER(nombre) = "salsa";', // error- filtra solo por salsa
        [lowerCaseType]
      );
      // no type found
      if (types.length === 0) return []

      const [{ id }] = types
      
      const [products] = await connection.query(
        'SELECT p.id, p.nombre, p.imagen, p.precio FROM product AS p inner join product_genre AS pg on p.id = pg.product_id WHERE pg.genre_id = ?;',[id]
      );
        return products
    }
    const [products] = await connection.query(
      'SELECT id, nombre, precio, picante, ingredientes, moneda, imagen from product;'
    )
    return products
  }
  static async getById ({ id }) {
      const [results] = await connection.query(
        'SELECT * FROM `product` WHERE `id` = ?',
        [id]
      );
      return results
  }
  static async create ({ input }) {
    const {
      type: typeInput, // type is an array
      nombre,
      precio,
      picante,
      ingredientes,
      moneda,
      imagen
    } = input

        // Con Crypto UUID 
        //crypto.randomUUID()

        // const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        // const [{ uuid }] = uuidResult
    
        // try {
        //   await connection.query(
        //     `INSERT INTO movie (id, title, year, director, duration, poster, rate)
        //       VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        //     [title, year, director, duration, poster, rate]
        //   )
        // } catch (e) {
        //   // puede enviarle información sensible
        //   throw new Error('Error creating movie')
        //   // enviar la traza a un servicio interno
        //   // sendLog(e)
        // }
    
        // const [movies] = await connection.query(
        //   `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        //     FROM movie WHERE id = UUID_TO_BIN(?);`,
        //   [uuid]
        // )
    
        // return movies[0]

    const [result] = await connection.query(
      'INSERT INTO product (nombre, precio, picante, ingredientes, moneda, imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, precio, picante, ingredientes, moneda, imagen]
    );
    
      const [products] = await connection.query(
      `SELECT nombre, precio, picante, ingredientes, moneda, imagen, id
      FROM product WHERE nombre = ?;`,
      [nombre]
      )
    return products
  }
  static async update ({ id, input }) {
    const {
      type: typeInput, // type is an array
      nombre,
      precio,
      picante,
      ingredientes,
      moneda,
      imagen
    } = input
    
    const [result] = await connection.query(
      'UPDATE product set precio = ? , moneda = ? WHERE id = ?',[precio, moneda, id]
    );
    const [updatedProduct] = await connection.query(
      'SELECT * FROM product WHERE id = ?',[id]
    )
  return updatedProduct
  }
  static async delete ({ id }) {
    const [result] = await connection.query(
      'DELETE FROM product WHERE id = ?',[id]
    );
  }
}