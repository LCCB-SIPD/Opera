
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const { productId, quanty } = await req.json()

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_UPDATE_QTY_PRD}`

        const response = await fetch(phpUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prId: productId, qty: quanty })
        })

        const result = await response.json()

        if (result.success) {

            return NextResponse.json( { message: result.message }, { status: 200 } )

        } else {

            return NextResponse.json( { error: result.message }, { status: 404 } )

        }

    } catch (error) {
        console.log(error)
        return NextResponse.json( { error: 'Database Error' }, { status: 500 } )
    }

    

}
