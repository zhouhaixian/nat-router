"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_1 = require("lowdb/node");
const domain = "router.mlkouying.cn";
const token = "DnS0G7VJtbh7K9idXL8IrAxSn8ppT2SM69Z4X4GqwKiYsPrO43";
const dbPath = "/mnt/nat-router";
const app = (0, express_1.default)();
const port = 3000;
const defaultRoute = { routes: {} };
(() => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, node_1.JSONFilePreset)(dbPath, defaultRoute);
    app.use(body_parser_1.default.json({ limit: "1mb" }));
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.post("/route", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.hostname == domain) {
            if (req.body.token == token) {
                const source = req.body.source;
                const destination = req.body.destination;
                yield db.update(({ routes }) => routes[source] = destination);
                res.send({ status: "success" });
            }
            else {
                res.status(403).send({ status: "token incorrect" });
            }
        }
        else {
            next();
        }
    }));
    app.all("*", (req, res) => {
        const hostname = req.hostname;
        const destination = db.data.routes[hostname];
        const url = `${req.protocol}://${destination}${req.originalUrl}`;
        res.redirect(302, url);
    });
    app.listen(port, () => {
        console.log(`Nat router is listening ${port}`);
    });
}))();
