import app from "./app"
import http from "http"
import * as dotenv from "dotenv"

dotenv.config()
const PORT: number = Number(process.env.PORT) || 8080

const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))