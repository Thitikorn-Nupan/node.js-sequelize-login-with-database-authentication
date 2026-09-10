import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'

export const modulesApp = {
    express : express,
    app : express() ,
    router : express.Router() ,
    bcrypt : bcrypt ,
    bodyParser : bodyParser
}