"use strict";
/*
Banco de dados: iconTag
Tabela: iconicos (id, name, uid, pontos, hours)
🚧 IMPLEMENTAR FUNÇÃO DE MULTIPLAS UID'S 🚧
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { pool } = require('./pool');
const uuid_1 = require("uuid");
// INSERIR NOVO ICONICO NO BANCO DE DADOS
const insertData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.headers['name'];
    const uid = req.headers['uid'];
    // VERIFICA SE O USUARIO EXISTE
    try {
        const exists = yield checkUid(uid);
        if (exists) {
            res.status(200).json(`Iconico já cadastrado`);
        }
        else {
            pool.query(`INSERT INTO iconicos (name, uid)
                 VALUES ('${name}', ${uid})`, (error, results) => {
                if (error)
                    throw error;
                res.status(201).json(`Iconico ${name} adicionado com o ID ${results.insertId}`);
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro interno ao verificar UID' });
    }
});
// INSERIR PONTO DE ENTRADA OU SAIDA
const setPoint = (req, res) => {
    const uuid = req.headers['uuid'];
    const data_time = req.headers['time'];
    // VERIFICA SE O USUARIO EXISTE
    pool.query(`SELECT * FROM iconicos 
         WHERE uid = ${uuid}`, (error, results) => {
        if (error)
            throw error;
        // USUARIO EXISTE
        if (results.length > 0 && typeof results !== undefined) {
            const userId = results[0].id;
            const userName = results[0].name;
            // VERIFICA ULTIMO PONTO
            pool.query(`SELECT * FROM pontos
                     WHERE userId = ${userId}
                     ORDER BY data DESC
                     LIMIT 1`, (error, results) => {
                if (error)
                    throw error;
                // BOOLEANO PARA VERIFICAR SE O USUARIO ESTA ENTRANDO OU SAINDO
                const last_point = results.length > 0 && typeof results !== undefined ? results[0].entrada : false;
                // INSERE NOVO PONTO
                pool.query(`INSERT INTO pontos (id_ponto, userId, uuid, name, data, entrada)
                             VALUES ('${(0, uuid_1.v4)()}', ${userId}, ${uuid}, '${userName}', '${data_time}', ${!last_point})`, (error) => {
                    if (error)
                        throw error;
                    // ATUALIZA PONTOS DO USUARIO
                    pool.query(`SELECT * FROM pontos
                                     WHERE userId = ${userId}
                                     ORDER BY data DESC
                                     LIMIT 1`, (error, results) => {
                        if (error)
                            throw error;
                        // ADICIONA UID DO PONTO NA LISTA DE PONTOS DO USUARIO
                        const ponto_uid = results[0].id_ponto;
                        pool.query(`UPDATE iconicos
                                             SET pontos = CONCAT_WS(IFNULL(',', ''), pontos, '${ponto_uid}')
                                             WHERE id = ${userId}`, (error) => { if (error)
                            throw error; });
                    });
                });
                // ATUALIZA HORAS DO USUARIO
                if (last_point == false) {
                    res.status(200).json(`Bem vindo ${userName}!`);
                }
                else {
                    try {
                        pool.query(`SELECT * FROM pontos
                                     WHERE userId = ${userId}
                                     ORDER BY data DESC
                                     LIMIT 2`, (error, results) => {
                            if (error)
                                throw error;
                            const entrada = new Date(results[1].data);
                            const saida = new Date(results[0].data);
                            const diff = (saida.getTime() - entrada.getTime()) / 1000;
                            const time = `${toHoursAndMinutes(diff).h}:${toHoursAndMinutes(diff).m}:${toHoursAndMinutes(diff).s}`;
                            pool.query(`UPDATE iconicos
                                             SET hours = ADDTIME(hours, '${time}')
                                             WHERE id = ${userId}`, (error) => { if (error)
                                throw error; });
                            res.status(200).json(`Até logo ${userName}!`);
                        });
                    }
                    catch (error) {
                        console.log(error);
                        res.status(500).json(`Erro interno ao atualizar horas do usuario`);
                    }
                }
            });
            // USUARIO NAO EXISTE
        }
        else {
            res.status(200).json(`Iconico não encontrado`);
        }
    });
};
// VERIFICA SE UID JA EXISTE NO BANCO DE DADOS
const checkUid = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM iconicos WHERE uid = ${uid}`, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
        return (yield results).length > 0 && typeof (yield results) !== undefined ? true : false;
    }
    catch (error) {
        console.log(error);
        return true;
    }
});
// CONVERTER SEGUNDOS EM HORAS
function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { h: hours, m: minutes, s: seconds };
}
module.exports = {
    insertData,
    setPoint,
};
