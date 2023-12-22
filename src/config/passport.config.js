import passport from 'passport';
import passportJWT from 'passport-jwt';

const extraerToken=(req)=>{
    let token=null;

    if(req.headers.authorization){
        console.log('toma token desde header authorization, via PASSPORT');
        token=req.headers.authorization.split(' ')[1]
    }else{
        if(req.cookies['codertokenCliente']){
            console.log('token desde cookie, via PASSPORT')
            token=req.cookies['codertokenCliente'];
        }else{
            if(req.headers.codertoken){
                console.log('token desde headers, via PASSPORT')
                token=req.headers.codertoken;
            }else{
                if(req.query.codertoken){
                    console.log('token desde query params, via PASSPORT')
                    token=req.query.codertoken;
                }
            }
        }
    }

    return token;
}

export const inicializaEstrategias=()=>{

    passport.use('jwt',new passportJWT.Strategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extraerToken]),
            secretOrKey: process.env.TOKEN_SECRET
        },
        (contenidoToken, done)=>{
            try {
                if(contenidoToken.usuario.apellido=='Santos'){
                    done(null, false, {messages:'El usuario Santos se encuentra temporalmente inhabilitado'})
                }

                done(null, contenidoToken.usuario)
            } catch (error) {
                done(error)
            }
        }
    ))

} // fin inicializaEstrategias()