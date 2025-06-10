import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
       console.log("Token", token)
       return NextResponse.json("Unauthorized", { status: 404 });
   }

    try {
        const user = jwt.verify(token, process.env.REACT_APP_JWT_SECRET_KEY);
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json( { error: error }, { status: 500 });
    }
}
