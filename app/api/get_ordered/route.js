import { NextResponse } from "next/server";

export async function POST(req) {
    
    const { username } = await req.json()
    
    try {

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_GET_ORDERED}`

        const response = await fetch(phpUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username
            })
        })

        console.log(username)

        const data = await response.json()
        
        if (!data.success) {

            return NextResponse.json( 
                { message: 'No Products Available' },
                { status: 404 } 
            )

        }

        return NextResponse.json(
            { message: 'Fetch all Successfully', data: data.data},
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
