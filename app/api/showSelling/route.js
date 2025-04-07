
import { NextResponse } from "next/server";

export async function POST(req) {
    
    const { username } = await req.json()

    const phpUrl = `${process.env.REACT_APP_PHP_FILE_SHOW_SELLING}`

    try {

        const response = await fetch(phpUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username
            })
        })

        const result = await response.json()

        if (result.success) {

            return NextResponse.json( { message: result.message, data: result.data }, { status: 200 } )

        } else {

            return NextResponse.json( { error: result.message }, { status: 400 } )

        }

     } catch(error) {

        return NextResponse.json( { error: 'Database Error' }, { status: 500 } )

     }

}
