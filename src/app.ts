import express from "express"
import router from "./routes"

const app = express()

// Routes
app.use('/', router)

export default app