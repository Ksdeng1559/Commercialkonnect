import document from "../../../../../openapi.json";
export function GET() {
  return Response.json(document, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
