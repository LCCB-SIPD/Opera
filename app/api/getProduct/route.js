import { NextResponse } from "next/server";


export async function GET() {

    try {

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_PRODUCT}`

        const response = await fetch(phpUrl)

        if (!response.ok) {

            return NextResponse.json( 
                { message: 'No Products Available' },
                { status: 300 } 
            )

        }

        const data = await response.json()

        return NextResponse.json(
            { message: 'Fecth all Successfully', data: data },
            { status: 200 }
         )

    } catch (error) {

        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );

    }

}