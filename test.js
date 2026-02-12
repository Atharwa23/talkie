// test.js -- 
// This file is for diagnostic purpose only and is used to troubleshoot Google API connectivity issues. This file has no application in project.
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
