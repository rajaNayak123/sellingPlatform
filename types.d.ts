import { Connection } from "mongoose"

declare global{
    var mongoose:{
        conn:Connection | null,
        promiss:Promise<Connection> | null
    }
}
export {}