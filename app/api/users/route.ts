import { NextResponse } from "next/server";
import supabase from "../../../services/supabaseClient";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 404 });
  } else {
    return NextResponse.json(data);
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();
  const { user_id, username } = body;
  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id in request body" },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: "Missing username in request body" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("users").insert([
    {
      user_id: user_id,
      username: username,
    },
  ]);

  if (error) {
    console.error(error.message);
    return NextResponse.json(error.message);
  } else {
    return NextResponse.json(data);
  }
};
