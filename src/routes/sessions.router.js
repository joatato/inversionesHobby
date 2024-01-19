import { Router } from "express";
import { usersModel } from "../dao/models/users.models.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt'

import { creaHash, creaJWT, esClaveValida } from "../utils/jwt.utils.js";

export const router = Router();


router.post('/register', async (req, res) => {

    let { name, lastname, email, password, age } = req.body;

    if (!email || !password) return res.sendStatus(400)

    let userActual = await usersModel.findOne({ email: email })

    if (userActual) return res.sendStatus(400);
    const jumps = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, jumps)
    await usersModel.create({
        name, lastname, email,
        // password:crypto.createHash('sha256','palabraSecreta').update(password).digest('base64'),
        password: passwordHash,
        age
    })

    res.redirect('/login');

})

router.post('/login', async (req, res) => {

    let { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400)
    
    //
    const user = await usersModel.findOne({ email: email });
    
    if (!user) {
        // No se encontró el usuario, enviar mensaje de error
        return res.status(401).json({ error: 'La contraseña es incorrecta' });
    }
    
    // Verificar la contraseña
    
    const passwordHash = await bcrypt.compare(password, user.password)
    if (!passwordHash) {
        // Contraseña incorrecta, enviar mensaje de error
        return res.status(401).json({ error: 'La contraseña es incorrecta' });
    }
    
    // Contraseña correcta, continuar con el flujo normal
    // Puedes enviar un mensaje de éxito si lo deseas
    //res.json({ message: 'Inicio de sesión exitoso' });

    

    req.session.user = {
        name: user.name,
        lastname: user.lastname,
        email,
        age: user.age
    }

    let userConRol = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email,
        age: user.age,
        rol: user.name == 'Diego' ? 'ADMIN' : 'USUARIO'
    }
    
    let token=creaJWT(userConRol);

    res.cookie('userToken',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('userTokenHttpOnly',token,{maxAge:1000*60*120, httpOnly:true})
    .cookie('userTokenSinHttpOnly',token,{maxAge:1000*60*120}).send({token});


})

// Log Out de Token
router.get('/logout', (req, res) => {
    // Limpiar las cookies relacionadas con el token
    res.clearCookie('codertoken');
    res.clearCookie('cookieConHttpOnly');
    res.clearCookie('cookieSinHttpOnly');

    // Redirigir a la página de inicio de sesión u otra página deseada
    res.redirect('/login');
});


// Log Out de sessiones

// router.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             res.sendStatus(500);
//         } else {
//             res.redirect('/login');
//         }
//     });
// })
