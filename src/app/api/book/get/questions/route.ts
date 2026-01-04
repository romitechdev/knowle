import Books from "@/controllers/book";
import { NextRequest, NextResponse } from "next/server";

const bookInstance = Books.getInstance();

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "12", 10);

  try {
    // Get books with "Question" tag - no auth required for public posts
    const books = await bookInstance.GetBooksFromQuestion(page, limit);

    return NextResponse.json({ books: books || [] });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ books: [] }, { status: 500 });
  }
}
