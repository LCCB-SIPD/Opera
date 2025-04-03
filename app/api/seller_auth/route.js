import { NextResponse } from "next/server";

export async function POST(req) {
    
        const formDataFile = await req.formData();
        const prd_name = formDataFile.get("prd_name")
        const prd_price = formDataFile.get("prd_price")
        const userId = formDataFile.get("userId")
        const username = formDataFile.get("username")
        const quantity = formDataFile.get("quantity")
        const categories = formDataFile.get("categories")
        const file = formDataFile.get("img");

        if (!file) {
            return NextResponse.json(
                { error: "No image file uploaded" },
                { status: 400 }
            );
        }

        const cleanPrd_name = prd_name.trim().replace(/\b\w/g, (char) => char.toUpperCase());
        const cleanPrd_price = parseFloat(prd_price.trim());
        const cleanCategories = categories.trim().replace(/\b\w/g, (char) => char.toUpperCase())
        const cleanQuantity = parseInt(quantity.trim(), 10);

        if (isNaN(cleanPrd_price) || isNaN(cleanQuantity)) {
            return NextResponse.json(
                { error: "Invalid price or quantity" },
                { status: 400 }
            );
        }

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_SELL_PRODUCT}`
        
        const formData = new FormData()
        formData.append("prd_name", cleanPrd_name)
        formData.append("prd_price", cleanPrd_price)
        formData.append("userId", userId)
        formData.append("username", username)
        formData.append("quantity", cleanQuantity)
        formData.append("categories", cleanCategories)
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
                { error: result.message },
                { status: 404 }
            )

        }
        

}

