const argon2 = require('argon2');
(async () => {
    try {
        const hash = await argon2.hash("password123");
        console.log("SUCCESS:", hash);
    } catch (e) {
        console.error("FAIL:", e.message);
    }
})();
