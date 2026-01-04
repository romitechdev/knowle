import Books from "@/controllers/book";
import { NextRequest, NextResponse } from "next/server";

const bookInstance = Books.getInstance()

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split("/")[4]
    const book = await bookInstance.GetBook(id)

    if (!book) return NextResponse.json({ msg: "Book not found!" }, { status: 404 })

    return NextResponse.json(book)
}
