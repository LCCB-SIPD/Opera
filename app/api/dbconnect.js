
// Now you can send the dbConfig to PHP
const sendDbConfigToPhp = async () => {
    const response = await fetch("http://localhost/server.php", {
        method: 'POST',  // Make sure it's POST, not GET
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }),
    });

    const result = await response.json();

    if (result.success) {
        console.log(`${result.message}`)
    }  // Print response from PHP to see if it worked
};

sendDbConfigToPhp();