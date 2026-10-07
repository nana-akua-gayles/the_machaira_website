export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const payload = await request.json();
    const email = payload.record?.email;
    if (!email) return new Response("No email", { status: 400 });

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({ email: email, updateEnabled: true }),
    });

    return new Response(JSON.stringify({ success: brevoRes.ok }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};