import { NextResponse } from "next/server";

export async function GET() {
    
    const phpUrl = `${process.env.REACT_APP_PHP_FILE_TEST_CONNECTION}`

    try {

        const response = await fetch(phpUrl)

        const result = await response.json()

        if (result.success) {

            return NextResponse.json( { status: 200 } )

        } else {

            return NextResponse.json( { status: 405 } )

        }

    } catch(error) {


        return NextResponse.json( {error: 'Database Error'}, { status: 500 } )

    }

    

}