// API route для обработки запросов от Chrome DevTools
// Это предотвращает ошибку 404 в консоли

export async function GET() {
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

