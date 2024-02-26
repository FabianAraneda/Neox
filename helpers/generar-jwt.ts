import jwt from 'jsonwebtoken';

interface Payload {
    id: number,
    name: string;
    email: string;
}

const generarJWT = (id: number, name: string, email: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const payload: Payload = { id, name, email };

        jwt.sign(payload, process.env.SECRETORPUBLICKEY as string, {
            expiresIn: '30m'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            } else {
                resolve(token as string);
            }
        });
    });
};

export { generarJWT };
