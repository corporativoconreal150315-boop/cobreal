export async function onRequestPost(context) {
  try {
    // 1. Recibir los datos del formulario web
    const formData = await context.request.formData();
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const contacto = formData.get('contacto');
    const mensaje = formData.get('mensaje');

    // 2. Estructurar el payload que pide MailChannels
    const mailPayload = {
      personalizations: [
        {
          to: [{ email: "contacto@cobreal.com.mx", name: "Corporativo Cobreal" }]
        }
      ],
      from: {
        // Usamos un correo del dominio que ya está autorizado y activo
        email: "contacto@cobreal.com.mx",
        name: "Sitio Web Cobreal"
      },
      subject: "Nuevo Mensaje de Contacto Web",
      content: [
        {
          type: "text/plain",
          value: `Has recibido un nuevo mensaje desde el formulario de la página web:\n\nNombre: ${nombre}\nEmail del cliente: ${email}\nTeléfono/Contacto: ${contacto}\n\nMensaje:\n${mensaje}`
        }
      ]
    };

    // 3. Hacer la petición a la API de MailChannels (Nativo en Cloudflare)
    const sendRequest = new Request("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(mailPayload),
    });

    const resp = await fetch(sendRequest);

    // 4. Validar si el envío fue exitoso
    if (resp.ok) {
      return new Response("OK", { status: 200 });
    } else {
      // Capturamos la respuesta exacta del servidor de correo para depurar fácilmente
      const errorBody = await resp.text();
      return new Response(`Error de MailChannels: ${errorBody}`, { status: 500 });
    }
  } catch (err) {
    return new Response(`Error interno del servidor: ${err.message}`, { status: 500 });
  }
}
