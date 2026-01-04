import Comments from "@/controllers/comment";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const commentInstance = Comments.getInstance();

export async function PATCH(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const id = req.nextUrl.pathname.split("/")[4];
    const { comment } = await req.json();

    const result = await commentInstance.editComment(id, comment, user._id.toString());

    if (result === null) return NextResponse.json({ msg: "Comment not found!" }, { status: 404 });
    if (result === "unauthorized") return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    if (result === 204) return NextResponse.json({ msg: "Empty Comment" }, { status: 204 });

    return NextResponse.json({ comment: result });
}
