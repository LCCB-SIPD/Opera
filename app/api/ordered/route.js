import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {


    try{
        const { username, owner, txHash, name, address, sellerAddress, quanty, resultVal } = await req.json();
    
        const phpUrl = `${process.env.REACT_APP_PHP_FILE_ORDERED}`;
    
        const response = await fetch(phpUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                owner: owner,
                txHash: txHash,
                name: name,
                address: address,
                sellerAddress: sellerAddress,
                quanty: quanty,
                resultVal: resultVal
            }),
        });
    
        const result = await response.json()
        
        if (result.success) {
            return NextResponse.json(
            { message: result.message },
            { status: 200 }
            )
        }else {
            return NextResponse.json(
            { message: result.message},
            { status: 404 }
            )
        }
       
    } catch(error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Database Error'},
            { status: 500 }
        )
    }
    
    
    
}
