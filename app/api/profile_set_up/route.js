
import { NextResponse } from "next/server";

export async function POST(req) {
    
    try {

        const formDataFile = await req.formData()
        const username = formDataFile.get('username')
        const name = formDataFile.get('name')
        const date = formDataFile.get('date')
        const address = formDataFile.get('address')
        const file = formDataFile.get('img')
       
        if (!file) {
            return NextResponse.json(
                { error: "No image file uploaded" },
                { status: 400 }
            );
        }

        const cleanName = name.trim().replace(/\b\w/g, (char) => char.toUpperCase());
        const cleanAddress = address.trim().replace(/\b\w/g, (char) => char.toUpperCase());

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_UPDATE_PROFILE}`

        const formData = new FormData()
        formData.append("username", username)
        formData.append("name", cleanName)
        formData.append("date", date)
        formData.append("address", cleanAddress)
        formData.append("img", file, file.name)

        const response = await fetch(phpUrl, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()

        if (result.success) {

            return NextResponse.json(
                { message: 'User Updated Successfully'},
                { status: 200 }
            )

        } else {

            return NextResponse.json(
                { error: 'Error'},
                { status: 404 }
            )

        }

        

    } catch (error) {
        console.error("Error during user update: ", error);
        return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
    }

}