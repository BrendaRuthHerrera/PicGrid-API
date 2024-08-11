import { Request, Response } from "express";
import connection from '../db/connection';

export const getLinks = (req: Request, res: Response) => {
    connection.query('SELECT * FROM aplicaciones', (err, data) =>{
        if(err) {
            console.log(err)
        }else {
            res.json({
                data
            })
        }
    })
}
