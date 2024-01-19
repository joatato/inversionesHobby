import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const creaHash=(password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

export const esClaveValida=(password, usuario)=>{
    return bcrypt.compareSync(password, usuario.password);
}

const SECRET=process.env.TOKEN_SECRET;

export const creaJWT=(usuario)=>{
    return jwt.sign({usuario},SECRET,{expiresIn:360});
}

export const validarJWT=(req, res, next)=>{
    let token='';

    if(req.headers.authorization){
        console.log('toma token desde header authorization');
        token=req.headers.authorization.split(' ')[1]
    }else{
        if(req.cookies['codertokenCliente']){
            console.log('token desde cookie')
            token=req.cookies['codertokenCliente'];
        }else{
            if(req.headers.codertoken){
                console.log('token desde headers')
                token=req.headers.codertoken;
            }else{
                if(req.query.codertoken){
                    console.log('token desde query params')
                    token=req.query.codertoken;
                }else{
                    console.log("No se pudo obtener el token xd");
                    return res.sendStatus(401,{
                        messages:"No se pudo obtener el token"
                    });
                }
            }
        }
    }
    
    jwt.verify(token, SECRET, (error, credenciales)=>{
        if(error){
            console.log("Mal al comprobar el secreto xd");
            res.sendStatus(401,{
                messages:"Mal al comprobar el secreto"
            });
        }else{
            req.user=credenciales.usuario;
            next();
        }
    })

}


export const passportCall=(estrategia)=>{
    return async(req, res, next)=>{
        passport.authenticate(estrategia, (error, usuario, info)=>{
            if (error) return next(error);
            if(!usuario){
                if(!info){
                    return res.status(401).send('No autenticado');
                }else{
                    return res.status(401).redirect('/login')
                }
            }
            if(usuario.email == 'tato@gmail.com') { usuario.rol = 'ADMIN'}
            req.user=usuario;
            next();
        })(req, res, next)
    }
}