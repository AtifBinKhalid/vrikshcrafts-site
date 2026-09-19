import { proxyPythonApi } from "../../../../lib/python-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return proxyPythonApi(request);
}

export async function POST(request: Request) {
  return proxyPythonApi(request);
}

export async function DELETE(request: Request) {
  return proxyPythonApi(request);
}
