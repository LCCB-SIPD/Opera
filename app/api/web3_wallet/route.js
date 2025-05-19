import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const { address, user_id } = await req.json();

        console.log(address)

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_WALLETADDRESS}`

        const response = await fetch(phpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                address: address,
                user_id: user_id
            })
        });

        const result = await response.json();

        

        if (result.success) {
            console.log(result.message)
            return NextResponse.json({ message: result.message }, { status: 200 });
            
        } else {

            return NextResponse.json({ error: result.message }, { status: 404 });

        }

        

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to save wallet' }, { status: 500 });
    }
    
}
