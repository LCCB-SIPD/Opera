
import { NextResponse } from "next/server";

export async function POST(req) {

    const { id } = await req.json()

    try {

        console.log(id)

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_PRD_DESTROYER}`

        const response = await fetch(phpUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        })

        const result = await response.json()

        if (result.success) {

            return NextResponse.json( { message: result.message }, { status: 200 } )

        } else {

            return NextResponse.json( { error: result.message }, { status: 404 } )

        }

    } catch(error) {

        console.log(error)
        return NextResponse.json( { error: 'API Error' }, { status: 500 } )

    }

}