import { Request, Response } from "express";
import connection from '../db/connection';
import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';

// Esta es la funcion para validar el email <3
const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


export const addUser = async (req: Request, res: Response) => {
   const { nombre, password, email } = req.body;
   console.log("Received registration data:", { nombre, password, email });

//Esto es la validación de email :3
   if (!email || !validateEmail(email)) {
    console.log("Invalid email:", email);
    return res.status(400).json({ msg: 'Email is invalid'});
   }

connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) {
       console.log("Error querying email:", err);
       return res.status(500).json({ msg: 'Error al verificar el correo electrónico' });
    }

    if (Array.isArray(results) && results.length > 0) {
        console.log("Email already registered:", email);
        return res.status(400).json({ msg: 'El correo electronicó ya esta registrado' });
    }



    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

connection.query('INSERT INTO usuarios SET ?', { nombre: nombre, password: hashedPassword, email: email }, (err, data) => {

    if(err) {
        console.log("Error inserting user:", err);
        return res.status(500).json({ msg: 'Error al registrar el usuario' });
    } else {
        res.status(201).json({
            success: true,
            msg:'Usuario registrado exitosamente'
        });
    }
});

});

};

export const loginUser = (req: Request, res: Response) => {
    
const { email, password } = req.body;
console.log("Received login data:", { email, password });

connection.query('SELECT * FROM usuarios WHERE email = ' + connection.escape(email), (err, data) => {
    if(err) {
        console.log("Error querying email:", err);
    } else {
       
        if (Array.isArray(data) && data.length > 0) {
            // Existe el usuario en la base de datos
            const userData = data[0];
            if ('password' in userData) {
                const userPassword = userData.password;
                console.log(userPassword);

            // comparar el password
                bcrypt.compare(password, userPassword).then((result) =>{
                    if(result) {
                        // Login exitoso genera el token
                        const token = jwt.sign({
                            email: email
                        }, process.env.SECRET_KEY!,{
                            expiresIn:'1h'
                        })

                        res.json({
                            token,
                        });
                    } else {
                        // Password incorrecto
                        res.json({
                            msg: 'Contraseña incorrecta',
                        });
                    }
                })

                
            } else {
                // No se encontró la propiedad 'password' en los datos
                res.json({
                    msg: 'Error en los datos del usuario',
                });
            }
        } else {
            // No existe el usuario en la base de datos
            res.json({
                msg: 'No existe el usuario en la base de datos',
            });
        }
        console.log(data);
    }
});

}