// test-connection.js
async function test() {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key={Your_Api_Key}');
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Success!");
  } catch (e) {
    console.error("Connection failed:", e.message);
  }
}
test();
