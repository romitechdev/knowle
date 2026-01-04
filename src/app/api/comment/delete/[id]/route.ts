import Comments from "@/controllers/comment";
import Users from "@/controllers/user";
import { NextRequest, NextResponse } from "next/server";

const userInstance = Users.getInstances();
const commentInstance = Comments.getInstance();

export async function DELETE(req: NextRequest) {
    const user = await userInstance.authRequest(req);
    if (!user) return NextResponse.json({ msg: "Invalid Authentication." }, { status: 401 });

    const id = req.nextUrl.pathname.split("/")[4];

    const result = await commentInstance.deleteComment(id, user._id.toString());

    if (result === null) return NextResponse.json({ msg: "Comment not found!" }, { status: 404 });
    if (result === "unauthorized") return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ msg: "Success" });
}
