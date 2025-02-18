import express from "express";
import bodyParser from "body-parser"
import { JSONFilePreset } from "lowdb/node"

const domain = "router.mlkouying.cn"
const token = "DnS0G7VJtbh7K9idXL8IrAxSn8ppT2SM69Z4X4GqwKiYsPrO43"
const dbPath = "/mnt/nat-router/routes.json"

const app = express()
const port = 9000
const defaultRoute: Routes = { routes: {} };
type Routes = {
    routes: any
}

(async () => {
    const db = await JSONFilePreset<Routes>(dbPath, defaultRoute)
    
    app.use(bodyParser.json({ limit: "1mb" }))
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.post("/route", async (req, res, next) => {
        if (req.hostname == domain) {
            if (req.body.token == token) {
                const source = req.body.source
                const destination = req.body.destination
                await db.update(({routes}) => routes[source] = destination)
                res.send({ status: "success" })     
            } else {
                res.status(403).send({ status: "token incorrect" })
            }
        } else {
            next()
        }
    })

    app.all("*", (req, res) => {
        const hostname = req.hostname
        const destination = db.data.routes[hostname]
        const url = `${req.protocol}://${destination}${req.originalUrl}`
        res.redirect(302, url)
    })

    app.listen(port, () => {
        console.log(`Nat router is listening ${port}`)
    })
})()