import { NextResponse } from "next/server"

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCkYAIK5ivU_iv7fxE4uvS2-DNgM46G82rNawd4MHUp1EKaO1EHuySmtigu05rQwEjlg/exec"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Google Script HTTP Error: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting contact form to Google Sheets:", error)
    return NextResponse.json(
      { error: "Failed to record message in Google Sheets" },
      { status: 500 }
    )
  }
}
