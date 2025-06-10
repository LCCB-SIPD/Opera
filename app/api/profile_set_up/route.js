
import { NextResponse } from "next/server";

export async function POST(req) {
    
    try {

        const formDataFile = await req.formData()
        const username = formDataFile.get('username')
        const name = formDataFile.get('name')
        const birthday = formDataFile.get('birthday')
        const address = formDataFile.get('address')
        const walletAddress = formDataFile.get('walletAddress')
        const file = formDataFile.get('img')
       
        if (!file) {
            return NextResponse.json(
                { error: "No image file uploaded" },
                { status: 404 }
            );
        }

        const cleanName = name.trim().replace(/\b\w/g, (char) => char.toUpperCase());
        const cleanAddress = address.trim().replace(/\b\w/g, (char) => char.toUpperCase());
        const cleanWalletAddress = walletAddress.trim().replace(/\b\w/g, (char) => char.toUpperCase());

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_UPDATE_PROFILE}`

        const formData = new FormData()
        formData.append("username", username)
        formData.append("name", cleanName)
        formData.append("birthday", birthday)
        formData.append("address", cleanAddress)
        formData.append("walletAddress", cleanWalletAddress)
        formData.append("img", file, file.name)

        const response = await fetch(phpUrl, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()

        if (result.success) {

            return NextResponse.json(
                { message: result.message},
                { status: 200 }
            )

        } else {

            return NextResponse.json(
                { error: result.message},
                { status: 404 }
            )

        }

        

    } catch (error) {
        console.error("Error during user update: ", error);
        return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
    }

}
